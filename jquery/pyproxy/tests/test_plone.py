import doctest
import transaction
from unittest import TestSuite

from Products.Five.testbrowser import Browser
from Products.Five import fiveconfigure, zcml

from Testing import ZopeTestCase as ztc
from Products.PloneTestCase import PloneTestCase as ptc
from Testing.ZopeTestCase.zopedoctest import ZopeDocFileSuite
from Testing.ZopeTestCase import FunctionalDocFileSuite

OPTIONFLAGS = (doctest.ELLIPSIS |
               doctest.NORMALIZE_WHITESPACE)

ptc.setupPloneSite()

import jquery.pyproxy


class PyproxyTestCase(ptc.FunctionalTestCase):
    def afterSetUp(self):
        # This hack allows us to get the traceback when an
        # 500 error is raised while using the browser.
        self.portal.error_log._ignored_exceptions = ()
        def raising(self, info):
            import traceback
            traceback.print_tb(info[2])
            print info[1]

        from Products.SiteErrorLog.SiteErrorLog import SiteErrorLog
        SiteErrorLog.raising = raising
        transaction.commit()

    def login_as_user(self, username, password):
        self.browser.open('%s/logout' % self.portal_url)
        self.browser.open('%s/login_form' % self.portal_url)
        self.browser.getControl(name='__ac_name').value = username
        self.browser.getControl(name='__ac_password').value = password
        self.browser.getControl(name='submit').click()

    def login_as_manager(self):
        self.login_as_user(ptc.portal_owner,
                           ptc.default_password)

    def disable_resources_merging(self):
        self.login_as_manager()
        for tool in ['portal_css', 'portal_javascripts']:
            self.portal[tool].debugmode = True
            self.portal[tool].autogroupingmode = False

    def install_products(self):
        fiveconfigure.debug_mode = True
        zcml.load_config('configure.zcml',
                         jquery.pyproxy)
        zcml.load_config('tests.zcml',
                         jquery.pyproxy)

        ztc.installPackage(jquery.pyproxy)
        self.addProfile('jquery.pyproxy:default')
        self.addProfile('jquery.pyproxy:tests')
        self.addProduct('jquery.pyproxy')

    def setup_data(self):
        self.portal_url = self.portal.absolute_url()
        self.browser = Browser()
        self.install_products()
        self.disable_resources_merging()


def test_suite():
    return TestSuite([
        doctest.DocTestSuite(
            module='jquery.pyproxy.base',
            optionflags=OPTIONFLAGS),

        doctest.DocTestSuite(
            module='jquery.pyproxy.utils',
            optionflags=OPTIONFLAGS),

        ZopeDocFileSuite(
            '../../README.rst',
            package='jquery.pyproxy',
            optionflags=OPTIONFLAGS),

        FunctionalDocFileSuite(
            'plone.txt',
            package='jquery.pyproxy.tests',
            optionflags=OPTIONFLAGS,
            test_class=PyproxyTestCase),
        ])
