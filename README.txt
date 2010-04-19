jquery.pyproxy
==============

The goal of jquery.pyproxy is to help integration of Ajax calls with JQuery
in Python powered sites.
The main idea is to use jquery syntax inside your Python call to
update the page the users are seeing. This way, you do not have to
return complex data to the Javascript client that will have to decrypt
them.


IMPORTANT: the product is not yet finalized and might not work in
every situations.
API described in this file in how it should be at the first release.

Simple example
--------------

A simple example should be easier to explain the idea behind
jquery.pyproxy. You do not want user to have to reload the full page
when submitting a comment to your blog, so you will use an Ajax call.
Here's how you do this with jquery.pyproxy.

First, you need to add the pyproxy javascript plugin to your page:
  <script type="text/javascript" src="/pyproxy.js"></script>

Then, you create a view that will manage the information sent by the user
(here with django, but the principle is the same with Plone)

from jquery.pyproxy.django import JQueryProxy, jquery

# The @jquery decorator handles the transformation of your results
# into JSON so we can decode it on client side.

@jquery
def ajax_add_comment(request):
    # The JQuery proxy object helps us to manipulate the page the user sees.
    jq = JQueryProxy()
    # The data/form sent with Ajax just apear like a classical POST form.
    form = request.POST

    #we do some validation of the form.
    ...


    if errors:
        # We display an error message.
        jq('#my_error_message').show()
        return jq

    ...
    # We display a success message.
    jq('#my_success_message').show()
    return jq

and finally, bind a jquery.pyproxy action to the button
used to submit a form.

  $(document).ready(function() {
    $('#submit_comment').pyproxy('click',
                                 '/ajax_add_comment',
                                 '#comment_form');
  });


Recognized JQuery methods
-------------------------

Currently, JQueryProxy supports all manipulation API of JQuery 1.4 and all
the effect API.

Extending JQuery proxy
----------------------

If you want to use a custom JQuery plugin, you can extend the JQueryProxy
object so it recognizes the method provided by your plugin.

To do this, you must create a dictionnary that describes the interface of 
the jquery plugin you want to use.

Let's say the plugin provides one method called showDialog. This method
take three parameters: the first one is a string, the second one is a string
or a integer, the last one is a dictionnary and is optionnal.
The dictionnary describing this plugin is the following:

  my_plugin = {'showDialog': [[str, unicode],
	    		     [str, unicode, int],
			     [dict, NoneType]]}

Then, the JQueryProxy object must be aware of this extension. In your view,
you can say:

  @jquery
  def my_view(request):
      jq = JQueryProxy()
      jq.extend_grammar(my_plugin)

      # Now, you can directly use this new method in your code.
      jq.showDialog('#something', 12, dict(opt1 = 2, opt2 = False))

If you need to use the custom plugin in all your Ajax views, it will be painfull
to extend the grammar every time.
You have some options to solve this.

1) if you use the source code of jquery.pyproxy:
add a file called my_plugin.py in jquery.pyproxy/jquerypyproxy/plugins.
in this file, describe your plugin with the dictionnary as explained before.
This dictionnary must be called 'grammar'.

2) you do not use the source, just the egg.
Create a new Python class, subclassing JQueryProxy. Declare a 'grammar' property
in this object that describes your grammar::

  def MyJqueryProxy(JQueryProxy):
      grammar = {'showDialog': [[str, unicode],
 	       		       [str, unicode, int],
			       [dict, NoneType]]}

and in your views, use this class instead of the JQueryProxy class.

3) integrate your grammar in the next release.
In any case, do not hesitate to submit the grammars you defined so it can
be integrated in the next release of jquery.pyproxy.


Limitations
-----------

jquery.pyproxytries to match as much as possible the jquery syntax so it's
easy to use existing code etc.
There is still two (at least) limitations. First, you can not do chained calls,
like this::

  jq('#mydiv').css('width': '200px').fadeIn()

Second, you can not store your selector, like this::

  mydiv = jq('#mydiv')
  mydiv.css('width': '200px')
  mydiv.fadeIn()

The proper way to write this code is::

  jq('#mydiv').css('width': '200px')
  jq('#mydiv').fadeIn()


I use Python but not Django or Plone
------------------------------------

You should use Django.

If this solution is not acceptable, you can still update the
@jquery decorator to work with your framework. The only
thing this decorator does is to transform the JQueryProxy object
returned by the function into JSON.
To make the transformation, this code is enough::

  import simplejson as json
  jq_to_json = json.dumps(jq.json_serializable())

Then, the jq_to_json object must be returned according to your
framework system (for example for Plone we just return it, for Django 
we wrap it into a HttpResponse object).

If you ported the @jquery decorator to any framework, please let me
know so it can be integrated in the next release.


Compatibility
-------------

Tested with JQuery 1.2 and 1.4
Tested with Python 2.4 and 2.6
Tested on Firefox, Chrome, Safari and IE.
