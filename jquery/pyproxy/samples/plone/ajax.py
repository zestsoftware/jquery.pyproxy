from Products.Five import BrowserView

from jquery.pyproxy.plone import JQueryProxy, jquery

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
