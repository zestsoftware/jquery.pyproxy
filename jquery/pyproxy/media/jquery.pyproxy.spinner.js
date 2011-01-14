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

    function center_spinner() {
	/* For the moment, the CSS solution is enough.
	 * We keep it here in case things change.*/
    }

    function show_spinner() {
	center_spinner();
	spinner_holder.show()
    }

    function hide_spinner() {
	center_spinner();
	spinner_holder.hide()
    }

    $(document).ready(function() {
	if (typeof(pyproxy_spinner_location) == 'undefined') {
	    if (typeof(portal_url) == 'string') {
		pyproxy_spinner_location = portal_url + '/pyproxy_spinner.gif';
	    } else {
		pyproxy_spinner_location = '/pyproxy_spinner.gif';
	    }
	}
	$('body').append('<div id="pyproxy_spinner"><img src="' + pyproxy_spinner_location + '"></div>');
	spinner_holder = $('#pyproxy_spinner');

	/* Binds the display on ajaxStart and ajaxStop */
	spinner_holder.
	    ajaxStart(show_spinner).
	    ajaxStop(hide_spinner);
    });
})(jQuery)