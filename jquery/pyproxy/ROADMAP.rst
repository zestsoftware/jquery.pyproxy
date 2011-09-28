Roadmap
=======

What should be coming for the next releases.

0.5
---

 - tests for the Plone specifics. [done]

 - tests for the Django specifics (there should only be the @jquery
   decorator).

0.6
---

 - refactor the jQuery plugin, so it takes only one argument which
   will be a dictionnary of options.

 - include some utility to extract data from a URL (the opposite of
   the native 'params' method).

 - allow debug mode for a specific call instead of having a
   global setting.

 - add custom events when request starts/ends.

 - use the events to show the spinner.


1.0
---

 - allow storing the selector and do multiple calls on it.

later on
--------

 - allow callbacks.
