from Products.Five import BrowserView

from jquery.pyproxy.plone import JQueryProxy, jquery, this
from jquery.pyproxy.samples import common

class Samples(BrowserView):
    @jquery
    def do_nothing(self):
        """ Well, the name speaks for himself.
        """
        return JQueryProxy()

    @jquery
    def form_to_string(self):
        """ Adds the content of the form in a div
        having the id 'pyproxy_tests_form_holder'
        """
        jq = JQueryProxy()
        jq('div#pyproxy_tests_form_holder').html(
            str(self.request.form))
        return jq

    @jquery
    def add_list_element(self):
        jq = JQueryProxy()
        return common.add_list_element(jq)

    @jquery
    def add_list_element_from_form(self):
        jq = JQueryProxy()
        return common.add_list_element_2(
            jq,
            self.request.form.get('text', ''))

    @jquery
    def link_generator(self):
        jq = JQueryProxy()
        return common.link_generator(jq)

    @jquery
    def show_portal_message(self):
        """ Displays a portal message.
        """
        jq = JQueryProxy()
        text = self.request.form.get('text', '')

        msg = ''
        msg_type = 'info'

        if text == '':
            msg = 'You have to enter some text'
            msg_type = 'error'
        elif len(text) < 10:
            msg = 'The text has ben saved, but it is a bit short'
            msg_type = 'warning'
        else:
            msg = 'The text has ben saved'

        jq.set_portal_message(msg, msg_type)
        return jq

    @jquery
    def hide_portal_message(self):
        """ Removes the portal message
        """
        jq = JQueryProxy()
        jq.hide_portal_message()
        return jq

    @jquery
    def translated_portal_message(self):
        """ Shows a portal message with a text translated
        in the user's language.
        """
        jq = JQueryProxy()
        from Products.CMFPlone import PloneMessageFactory as PMF
        msg = PMF(u'This field is required, please provide some information.')
        jq.set_portal_message(msg, 'info')
        return jq

    @jquery
    def replace_this_content(self):
        """ Replaces the content of the binded elements with
        'Content replaced'
        """
        jq = JQueryProxy()
        jq(this).html('Content replaced')
        return jq

    @jquery
    def chained_calls(self):
        """ Simple demo for chained calls.
        """
        jq = JQueryProxy()
        jq(this).parent().find('span').addClass('my_new_class')
        return jq
