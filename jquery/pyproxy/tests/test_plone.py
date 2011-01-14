import doctest
from unittest import TestSuite

from Testing.ZopeTestCase.zopedoctest import ZopeDocFileSuite
    
OPTIONFLAGS = (doctest.ELLIPSIS |
               doctest.NORMALIZE_WHITESPACE)

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
        ])
