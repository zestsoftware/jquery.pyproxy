Roadmap
=======

What should be coming for the next releases.

0.3
---

 - tests for the base Python modules. [done]

 - extract sub functions to ease unit testing. [done]

 - tests for the jQuery plugin itself. [done]

 - embed spinner in the package. [done - Django users still have to do
   some manual steps]

0.4
---

 - tests for the Plone specifics.

 - tests for the Django specifics (there should only be the @jquery
   decorator).

 - refactor the jQuery plugin, so it takes only one argument which
   will be a dictionnary of options.

 - include some utility to extract data from a URL (the opposite of
   the native 'params' method).

 - allow debug mode for a specific call instead of having a
   global setting.

 - add custom events when request stqrts/ends.

 - use the vents to show the spinner.

0.5
---

 - allow chained calls on the Python side.

1.0
---

 - allow storing the selector and do multiple calls on it.

later on
--------

 - allow callbacks.
