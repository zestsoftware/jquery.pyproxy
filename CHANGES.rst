Changelog
=========

0.5 (2013-09-24)
----------------

- Add empty upgrade step to properly set our profile version.
  [maurits]

- Adapt imports to work in Plone 3.3 through 4.3.
  [maurits]


0.4.3 (2013-06-04)
------------------

- Point to http://github.com/zestsoftware/jquery.pyproxy
  [maurits]

- added Django specific tests. [vincent]

- finished Plone specific tests. [vincent]


0.4.2 (2013-02-25)
------------------

- Fix issue with Diazo wrapping the responses with HTML
  tags. [vincent]


0.4.1 (2011-09-19)
------------------

- Updated the minified version. [vincent]

0.4 (2011-09-19)
----------------

- added find() and parent() support. [vincent]

- added support for chained calls. [vincent]

- Added support for 'this'. [vincent]


0.3.1 (2011-05-09)
------------------

- removed the 'debug' fonction that was sometimes comflicting with
  other products. [vincent]


0.3 (2011-02-25)
----------------

- you can now specify a callback without specifying a form to
  send. [vincent]

- added tests for the jQuery plugin. [vincent]

- removed the 'eval()' calls in process_call. Also removed
  arg_to_string not needed anymore and disabled 'clean_string' which
  is also not needed anymore. [vincent]

- extracted sub-methods from the jquery plugin to easy testing. All
  are prefixed with pyproxy to avoid name conflicts. [vincent]

- added roadmap. [vincent]

- added extra JS/CSS file to show a spinner when a request is
  done. The spinner image was generated using ajaxload.info/ [vincent] 

- finally added tests for the base python code. Tests for the jquery
  plugin and customized Plone.Django object to come. [vincent+maurits]

- IMPORTANT: the 'grammar' attribute has been renamed 'base_grammar'
  attribute. If you created sub-classes of the JQueryProxy object,
  update them. Using the 'grammar' attribute caused a problem as it
  was not initialized in the __init__ method, the value was spread to
  every instances of the JQueryProxy object. [vincent]

- added a 'batch' method on the JueryProxy object to process multiple
  entries. It should be used to replace show_errors and
  hide_errors. [vincent]

- deprecated jq.show_errors and jq.hide_errors as it was based
  on Plone CSS classes. [vincent]

- moved 'clean_string', 'package_contents' and 'custom_endswith' to
  utils. [vincent]

- small bugfix in Plone version to hide the previous portal
  messages. [vincent]

- updated __init__.py to declare the namespace to avoid problems with
  setuptools 0.7. [vincent]


0.2 (2010-10-22)
----------------

- renamed django.py in jq_django.py as it was giving conflicts when
  importing HttpResponse. [vincent]

- moved jquery.pyproxy.js in a folder called 'media' so it can be used
  easily by django user with django-appmedia. Also added some
  registration for plone users so jquery.pyproxy appears in the
  quick_installer and automatically adds the JS file to the
  jsregistry. [vincent]

- bugfix: fadeOut and fadeIn did not have correct names in
  plugins/jq_effects. [vincent]

- Added 'PreventDefault' in make_call - using 'return false' works for
  links but is not enough for submit buttons. [vincent]


0.1 (2010-04-19)
----------------

- bugfix in base: package_contents did not work with python
  2.4. [vincent]

- renamed jquerypyproxy in jquery.pyproxy [vincent]

- bugfix in base: the grammar was not passed to the objects
  created. [vincent] 

- bugfix in base: str.endswith(tuple) only works in python 2.5+, added
  a custom endswith. [vincent]

- bugfix in plone.py: typo in the class name. [vincent]

- added append in grammar. [vincent]

- added basic javascript calls. [vincent]

- added JQueryProxy Python class and decorators for plone and
  Django. [vincent]

- added log file + python egg. [vincent]

