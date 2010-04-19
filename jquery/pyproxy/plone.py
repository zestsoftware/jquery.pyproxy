import simplejson as json

from zope.app.component.hooks import getSite
from Products.CMFCore.utils import getToolByName
from zope.i18n import translate
from zope.i18nmessageid.message import Message

from Products.CMFPlone import PloneMessageFactory as _p

from base import JQueryProxy as JQueryProxyBase

class JQueryProxy(JQueryProxyBase):

    def _get_default_language(self):
        portal = getSite()
        
        props = getToolByName(portal, 'portal_properties')
        return props.site_properties.getProperty('default_language')


    def set_portal_message(self, message, msg_type='info'):
        """ Adds or update the portal message.

        It hides both portal messages (the normal one and the KSS
        one and recreates a fresh one.
        """ 

        # We hide the existing ones.
        self('dl .portalMessage').hide() 

        # We delete our portal message.
        self('#jq_portal_msg').remove() 

        # And create a fresh one.
        html = '<dl id="jq_portal_msg" class="portalMessage %s">' +\
               '<dt>%s</dt><dd>%s</dd></dl>'

        # We get the correct title (Info, Warning, Error)
        if not msg_type in ['info', 'warning', 'error']:
            msg_type='info'

        lang = self._get_default_language()
        msg_title = translate(_p(unicode(msg_type.capitalize())),
                              target_language=lang)

        # The message might not be translated.
        if type(message) == Message:
            message = translate(message, target_language=lang)
 
        self('#viewlet-above-content').before(html % (msg_type,
                                                      msg_title,
                                                      message))

    def hide_portal_message(self):
        """ Hides all portal messages.
        """
        self('dl .portalMessage').hide()

def jquery(function):
    """ The @jquery decorator can be added to a function
    that returns a JQuery object.
    This method will return the JQuery object serialized as a
    JSON string.
    """
    def _jquery(*args, **kwargs):
        jq = function(*args, **kwargs)
        if jq:
            return json.dumps(jq.json_serializable())
        else:
            return
    return _jquery
