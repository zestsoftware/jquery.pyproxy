/* 
 * Adds a div containing a spinner image at the end of the body.
 * For Plone user's, the 'pyproxy_spinner.gif' is automatically added
 * to the skins folder (so you can override it easily.
 * For Django users, you'll have to add it manually at the root of the site,
 * or to declare a global javascript  variable called 'spinner_location' that
 * provides the url for the spinner.
 * It also binds showing/hidding the spinner every time a Ajax request is
 * done.
 */

(function($){
    var spinner_holder;
    var isIE6;

    function center_spinner() {
	/* The CSS based version works in all browser,
	 Ho wait... hi IE6, glad to meet you again.
	*/
	if (isIE6) {
	    var w = $(window);
	    var top = Math.round(w.scrollTop() + (w.height() / 2)) + 'px';
	    var left = Math.round(w.scrollLeft() + (w.width() / 2)) + 'px';
	    spinner_holder.css({'position': 'absolute', 'top': top, 'left': left});
	}
    }

    function show_spinner() {
	center_spinner();
	spinner_holder.show()
    }

    function hide_spinner() {
	spinner_holder.hide()
    }

    $(document).ready(function() {
	/* If a custom location for the spinner has been defined, we use it.
	 * In the other case, if 'portal_url' is available (that means we
	 * have a Plone site) we know that the spinner can be reached
	 * there.
	 * If both fails, we use the relative path to the root of the site.
	 */
	if (typeof(pyproxy_spinner_location) == 'undefined') {
	    if (typeof(portal_url) == 'string') {
		var pyproxy_spinner_location = portal_url + '/pyproxy_spinner.gif';
	    } else {
		var pyproxy_spinner_location = '/pyproxy_spinner.gif';
	    }
	}

	/* We check that the browser does not come from hell.
	 * Code stollen from Ion Todirel's comment here:
	 * http://www.thefutureoftheweb.com/blog/detect-ie6-in-javascript#comment5 */
	isIE6 = /msie|MSIE 6/.test(navigator.userAgent);

	/* And we finally add our small div to the bottom of the page */
	$('body').append('<div id="pyproxy_spinner"><img src="' + pyproxy_spinner_location + '"></div>');
	spinner_holder = $('#pyproxy_spinner');

	/* Binds the display on ajaxStart and ajaxStop */
	spinner_holder.
	    ajaxStart(show_spinner).
	    ajaxStop(hide_spinner);
    });
})(jQuery)