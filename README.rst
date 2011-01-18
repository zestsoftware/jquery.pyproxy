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

Installing
----------

Add jquery.pyproxy to your buildout eggs and run the buildout, if you
do not use buildout, you can easy_install jquery.pyproxy (or do as you
usually do with other products).

In Plone, go to the quickinstaller and install jquery.pyproxy. That's
all, happy Plone users can now skip to 'Simple example'.

In Django, you should also add ``django-appmedia`` to you buildout eggs
and ``appmedia`` to the list of installed apps. Run buildout, then run
bin/django symlinkmedia.
Now in your templates, add::

  <script type="text/javascript" src="{{MEDIA_URL}}/pyproxy/jquery.pyproxy.min.js"></script>

If you want to have a spinner automatically shown when a request is
done, you can also add in your header::

  <script type="text/javascript" src="{{MEDIA_URL}}/pyproxy/jquery.pyproxy.spinner.min.js"></script>
  <link rel="stylesheet" href="{{MEDIA_URL}}/pyproxy/jquery.pyproxy.spinner.css" type="text/css" media="screen">

You need to have a ``pyproxy_spinner.gif`` image available at the root of
the site. If not (or if your media files are hosted on a different
subdomain), you should declare a javascrit variable called
``pyproxy_spinner_location`` that points to the URL of the file. The
declaration should be done before including the
``jquery.pyproxy.spinner.js`` file.

If you do not want to use app_media, you can download the javascript
library from github
(https://github.com/vincent-psarga/jquery.pyproxy/blob/master/jquery/pyproxy/media/jquery.pyproxy.min.js
- please ensure to match the egg version and js version) and install
it to your media folder. You can then include it to your 
templates.


Simple example
--------------

A simple example should be easier to explain the idea behind
jquery.pyproxy. You do not want user to have to reload the full page
when submitting a comment to your blog, so you will use an Ajax call.
Here's how you do this with jquery.pyproxy.

First, you create a view that will manage the information sent by the user
(here with django, but the principle is the same with Plone)::

  from jquery.pyproxy.jq_django import JQueryProxy, jquery

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

      # If the JQueryProxy object is not returned, nothing happens.
      return jq

and finally, bind a jquery.pyproxy action to the button
used to submit a form::

  $(document).ready(function() {
    $('#submit_comment').pyproxy('click',
                                 '/ajax_add_comment',
                                 '#comment_form');
  });


Using the JQueryPyproxy object
------------------------------

First, you need to import the correct JQueryProxy object:

 - if you use Plone: from jquery.pyproxy.plone import JQueryProxy

 - if you use Django: from jquery.pyproxy.jq_django import JQueryProxy

Both are based on the same object, defined in the base.py module::

      >>> from jquery.pyproxy.base import JQueryProxy

The main idea behind this project was to be able to use the same
syntax than with jQuery, so you can more or less copy-paste some
samples on the web or some existing code.
Of course, as we are using Python, we can not use the dollar sign as a
identifier::

      >>> $ = JQueryPyproxy()
      Traceback (most recent call last):
      ...
      SyntaxError: invalid syntax

So in our examples we declare our object as ``jq``, which is the classic
way in Plone to name the jQuery object::

      >>> jq = JQueryProxy()

Currently, JQueryProxy supports all manipulation API of JQuery 1.4 and all
the effect API.

      >>> sorted(jq.grammar.keys())
      ['addClass', 'after', 'animate', 'append', 'appendTo', 'attr',
       'before', 'css', 'detach', 'empty', 'fadeIn', 'fadeOut', 'fadeTo',
       'hide', 'html', 'insertAfter', 'insertBefore', 'prepend', 'prependTo',
       'remove', 'removeAttr', 'removeClass', 'replaceAll', 'replaceWith',
       'show', 'slideDown', 'slideToggle', 'slideUp', 'text', 'toggle',
       'toggleClass', 'unwrap', 'wrap', 'wrapAll', 'wrapInner']

So if you know how to use them in jQuery, you know how to use them
with pyproxy, for example::

      >>> jq('#error_msg').html('Errors have been found, please correct them')
      >>> jq('#error_email').show()

The way the jQuery methods are declared are matching the API of
jQuery (except for the callbacks, see the 'Limitations' part). So if
you use incorrect arguments, you will get errors in the Python code
(which should help you a lot when debugging, at least you should have
server logs)::

      >>> jq('.to_slide').slideDown()
      Traceback (most recent call last):
      ...
      TypeError: Method 'slideDown' takes exactly 1 arguments

      >>> jq('.empty').empty('Spanish argument is like Spanish inquisition: no one expects it')
      Traceback (most recent call last):
      ...
      TypeError: Method 'empty' does not take any argument

      >>> jq('.to_fade').fadeTo('something', 'wrong type')
      Traceback (most recent call last):
      ...
      TypeError: Argument 2 of method fadeTo must be: <type 'int'>

If you need to process a list of selectors, you can use the ``batch``
method of the JQueryObject. It takes five arguments:

 - a list of selectors
 - the method to apply
 - the list of arguments for this method
 - a prefix to add before each selector (optional)
 - a substituion list on which the selector will be applied (optional)

That can be usefull for example when you have a list of error to display::

      >>> my_errors = ['email', 'title', 'text']
      >>> jq.batch(my_errors, 'addClass', ['error'], substitution='#%s_error')
      >>> jq.list_calls()[-3:]
      ["jq('#email_error').addClass('error')",
       "jq('#title_error').addClass('error')",
       "jq('#text_error').addClass('error')"]

That is equivalent to::

      >>> for err in my_errors:
      ...     jq('#' + err + '_error').addClass('error')
      >>> jq.list_calls()[-3:]
      ["jq('#email_error').addClass('error')",
       "jq('#title_error').addClass('error')",
       "jq('#text_error').addClass('error')"]

When you need to have a clear overview of which calls have been done
by the jq object, you can use the ``list_calls`` method::

      >>> jq.list_calls()
      ["jq('#error_msg').html('Errors have been found, please correct them')",
       "jq('#error_email').show()",
       "jq('.to_slide').slideDown()",
       "jq('.empty').empty()",
       "jq('.to_fade').fadeTo()",
      ...]

You can see that even failing calls are stored here (but not the
parameters).
This is due to the fact that we are in the doctests. In
real-life use case, as a exception is raised your code will stop after
the problem has been found.


Extending JQuery proxy
----------------------

If you want to be able to use jQuery methods that are not known by
default, you have to extend the list of methods known by JQueryPyproxy.
In our example, we'll consider that you want to use a ``showDialog``
method from an extra-plugin.
By default, it does not works (which is logical as pyproxy does not
have a clue of which jQuery plugins you are using)::

      >>> jq('.bla').showDialog()
      Traceback (most recent call last):
      ...
      AttributeError: 'JQueryCommand' object has no attribute 'showDialog'

To be able to use the method, you need to define the list of extra
methods you want to use and the parameters expected.
Here we only define the ``showDialog`` method, taking three parameters
(the first one is a string or unicode, the second one an int, a string
or a unicode and the last one a optional dictionnary)::

      >>> from types import NoneType
      >>> my_plugin = {'showDialog': [[str, unicode],
      ...                             [str, unicode, int],
      ...                             [dict, NoneType]]}

Then, you can use the ``extend_grammar`` method so your methods are recognized::

      >>> jq.extend_grammar(my_plugin)
      >>> 'showDialog' in jq.grammar
      True
      >>> jq.grammar['showDialog']
      [[<type 'str'>, <type 'unicode'>],
       [<type 'str'>, <type 'unicode'>, <type 'int'>],
       [<type 'dict'>, <type 'NoneType'>]]
      >>> jq('#my_dialog').showDialog('some text', 42, dict(opt1 = 2, opt2 = False))


And of course it respects the grammar you defined::

      >>> jq('.bla').showDialog()
      Traceback (most recent call last):
      ...
      TypeError: Method 'showDialog' takes between 2 and 3 arguments

      >>> jq('.bla').showDialog(1, 2, 3)
      Traceback (most recent call last):
      ...
      TypeError: Argument 1 of method showDialog must have one of the following types: [<type 'str'>, <type 'unicode'>]

      >>> jq('.grep').showDialog('blabla', 'fich')

If you need to use custom methods in all your Ajax views, it will be painfull
to extend the grammar every time.
You have some options to solve this.

1) if you use the source code of jquery.pyproxy:
add a file called ``my_plugin.py`` in jquery.pyproxy/jquery/pyproxy/plugins.
In this file, describe your plugin with the dictionnary as explained before.
This dictionnary must be called ``grammar``.

2) you do not use the source, just the egg.
Create a new Python class, subclassing JQueryProxy. Declare a
``base_grammar`` property in this object that describes your grammar::

      >>> class MyJQueryProxy(JQueryProxy):
      ...     base_grammar = {'showDialog': [[str, unicode],
      ...                                    [str, unicode, int],
      ...                                    [dict, NoneType]]}
      >>> my_jq = MyJQueryProxy()
      >>> my_jq('.bla').showDialog('a', 2)

and in your views, use this class instead of the JQueryProxy class.

3) integrate your grammar in the next release.
In any case, do not hesitate to submit the grammars you defined so it can
be integrated in the next release of jquery.pyproxy.


Limitations
-----------

There is currently three (at least) major limitations.

First, you can not do chained calls, like this::

      >>> jq = JQueryProxy()
      >>> jq('.nice_divs').css({'width': '200px'}).fadeIn(10)
      Traceback (most recent call last):
      ...
      AttributeError: 'NoneType' object has no attribute 'fadeIn'

Second, you can not store your selector, like this::

      >>> jq = JQueryProxy()
      >>> divs = jq('.nice_divs')
      >>> divs.css({'width': '200px'})
      >>> divs.fadeIn(10)

It seems to work fine, but if we have a close looks to what has been
stored by the jq object, we can see that only the last call was
saved and the call to 'css({width': '200px'})' will never be executed::

      >>> jq.list_calls()
      ["jq('.nice_divs').fadeIn(10)"]

The proper way to write this code is::

      >>> jq = JQueryProxy()
      >>> jq('.nice_divs').css({'width': '200px'})
      >>> jq('.nice_divs').fadeIn(10)

Now if we look at what has ben stored by the object, we see all wanted
calls::

      >>> jq.list_calls()
      ["jq('.nice_divs').css({'width': '200px'})",
       "jq('.nice_divs').fadeIn(10)"]

The third one is that the callback are not handled, so you can not use
something like this::

      >>> jq('.animated').show(10, 'my_callback')
      Traceback (most recent call last):
      ...
      TypeError: Method 'show' takes between 0 and 1 arguments

Even if the jQuery doc tells that the show method can take multiple
arguments (which is true, but not here).


Is there some samples available ?
---------------------------------

If you use Plone, add the following to one available
``configure.zcml`` file (the one from your theme from example)::

  <include package="jquery.pyproxy.samples.plone" />

Restart the instance and then open
``http://localhost:8080/your_plone_site/pyproxy_samples``.

If you use Django, some samples will be added later.

Testing the module
------------------

There are tests embedded in this package to ensure it works
correctly. To run the tests on the python side, you can run::

      bin/instance test -m jquery.pyproxy (for Plone users)
      bin/django test pyproxy (for Django users with a buildout)
      ./manage.py test pyproxy (for Django users without buildout)

There is also qUnit tests to ensure the jQuery library works
correclty. FOr the oment it is only available for Plone users. First,
you have to load the 'tests.zcml' file from jquery.pyproxy.
For example in the main configure.zcml of a product you develop::

  <include package="jquery.pyproxy"
           file="tests.zcml" />

Then, in the ZMI, go to the portal_setup, then the ``import``
tab. Select ``jquery.pyproxy tests`` in the list, select the ``Skins
tools`` step and then click on ``Import selected steps``.
In the ``portal_skins`` tool, you should see a new folder call
``pyproxy_tests``. Now open
``http://localhost:8080/your_plone_site/pyproxy_tests`` and you will
see the qUnit tests running.

I use Python but not Django or Plone
------------------------------------

You should use Django.

If this solution is not acceptable, you can still update the
@jquery decorator to work with your framework. The only
thing this decorator does is to transform the JQueryProxy object
returned by the function into JSON.
To make the transformation, this code is enough::

      >>> import simplejson as json
      >>> jq_to_json = json.dumps(jq.json_serializable())
      >>> jq_to_json
      '[{"args": [{"width": "200px"}], "call": "css", "selector": ".nice_divs"}, {"args": [10], "call": "fadeIn", "selector": ".nice_divs"}, {"args": [], "call": "show", "selector": ".animated"}]'

Then, the jq_to_json object must be returned according to your
framework system (for example for Plone we just return it, for Django 
we wrap it into a HttpResponse object).

If you ported the @jquery decorator to any framework, please let me
know so it can be integrated in the next release.


Compatibility
-------------

Tested with:

 - jQuery 1.2 and 1.4

 - Python 2.4 and 2.6

 - Firefox

 - Chrome

 - Safari

 - IE
