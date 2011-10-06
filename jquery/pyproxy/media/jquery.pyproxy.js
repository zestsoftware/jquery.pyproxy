/*******************************************************************************
 * jquery.pyproxy.js
 * author: Vincent Pretre (Zest Software)
 * desc: provides a simple way to integrate Ajax calls in Python-based website.
 * $.pyproxy_call(options): makes an Ajax call to a remote pyproxy method.
 * $('myselector').pyproxy(options): binds a pyproxy_call.
 *
 * options:
 * - event (unused with pyproxy_call): the event to bind the call to.
 * - url: the URL of the method called with Ajax.
 * - data: a dictionnary of data to send in the Ajax request.
 * - data_selector: a selector for the form containing the data
 *    (for example '#myform')
 * - original_this (only used with pyproxy_call): if the remote method uses
 *    the keyword 'this', you need to set this value to 'this' in the call
 *    when using pyproxy, this value is automatically set.
 ******************************************************************************/
(function($) {
    var default_options = {
	'event': '',
	'url': '',
	'data': {},
	'data_selector': null,
	'original_this': null
    }

    /*
     * Transforms a form into a dictionnary that can be sent
     * to the Ajax call.
     */
    $.pyproxy_form_to_dict = function(form_id) {
	var inputs = $(form_id + ' :input');
	var dict = {};

	for (i=0; i<inputs.length; i++) {
	    var input = inputs[i];
	    var add = false;
	    var name = String(input.name);

	    if ($(input).hasClass('pyproxyIgnore')) {
		continue;
	    }

	    if (input.type == 'radio') {
		if (input.checked) {
		    add = true;
		}
	    } else if (input.type == 'checkbox') {
		if (input.checked) {
		    /* If we have not stored anything yet, we create a 
		       list.*/
		    
		    if (!(name in dict)) {
			dict[name] = [];
		    }
		    
		    /* We append the value at the end of the list.
		       Yeah, ugly code, but it's basically like saying:
		       l[l.length] = x 
		       It's just more readable with a simple descriptor for the
		       list.
		    */
		    dict[name][dict[name].length] = $(input).val();
		}
	    }
	    else {
		add = true;
	    }
	    
	    if (add) {
		dict[name] = $(input).val();
	    }
	}
	return dict;
    };

    /* Process the data  */
    $.pyproxy_process_data = function(data, options, original_this) {
	var command, selector, i, meth;

	if (typeof(options) == 'undefined') {
	    options = {'callback': null,
		       'original_this': null};
	} else 	if (typeof(options) == 'function') {
	    // Old style API.
	    options = {'callback': options,
		       'original_this': original_this};
	}

	for (i=0; i < data.length; i++) {
	    command = data[i];

	    if (typeof(command.selector.__pyproxy_custom) != 'undefined' && command.selector.is_this) {
		if (typeof(options['original_this']) == 'undefined') {
		    continue;
		}
		selector = $(options['original_this']);
	    } else {
		selector = $(command.selector);
	    }

	    do {
		meth = selector[command.call]
		selector = meth.apply(selector, command.args);
		if (typeof(command.next) == 'undefined') {
		    break;
		}
		command = command.next;
	    } while (true);
	}
	
	if (typeof(options['callback']) == 'function') {
	    options['callback'](data);
	}
    }

    /*
     * Returns a dictionary of data usable for a POST request.
     * It first checks if there's a 'data' entry in the options.
     * Otherwise it uses an empty dictionary.
     * Then it checks if there's a 'data_selector' entry. If so, it 
     * extends the previous dictionary using $.pyproxy_form_to_dict
     * with that selector.
     */
    $.pyproxy_grab_data = function(options){
	var data = $.extend({}, options['data']);
	if (typeof(options['data_selector']) == 'string' && options['data_selector'].length > 0) {
	    $.extend(data, $.pyproxy_form_to_dict(options['data_selector']));
	}

	return data;
    }

    /*
     * $.pyproxy_call(options)
     * See options description at the top of the file.
     *
     * DEPRECATED: $.pyproxy_call(url, [data, [callback]])
     * Call the page located at URL and executes the jquery methods returned by
     * the page.
     *
     * If data is a string, the method considers it's the selector for the form
     * to send.
     * If data is a dictionnary, the method sends them to the page.
     * All data are sent as POST.
     *
     * Callback is a function which is executed once the call done.
     */
    $.pyproxy_call = function(url, data, callback, original_this) {
	var options = {}
	if (typeof(url) == 'object') {
	    /* Using new style API. */
	    $.extend(options, default_options, url);
	} else {
	    /* Old-style API. */
	    $.extend(options, default_options);
	    options['url'] = url;

	    if (typeof(data) == 'string') {
		options['data_selector'] = data;
		options['callback'] = callback;
		options['original_this'] = original_this;
	    } else if (typeof(data) == 'object') {
		options['data'] = data;
		options['callback'] = callback;
		options['original_this'] = original_this;
	    } else if (typeof(data) == 'function') {
		options['callback'] = data;
		if (typeof(callback) != 'undefined') {
		    options['original_this'] = callback;
		} else if (typeof(original_this) != 'undefined') {
		    options['original_this'] = original_this;
		}
	    }
	}

	return $.ajax({type: 'POST',
		       url: options['url'],
		       data: $.pyproxy_grab_data(options),
		       success: function(d) {
			   $.pyproxy_process_data(d, options);
		       },
		       dataType: "json"});
    };

    /*
     * $('#something').pyproxy(options)
     * See options description at the top of the file.
     *
     * DEPRECATED: $('#something').pyproxy(event, url, [data, [callback]])
     * Binds a call to pyproxy_call with the provided event for
     * items matching the selctor.
     * You must use events that can be used with 'live'.
     */
    $.fn.pyproxy = function(event, url, data, callback) {
	var options = {}
	if (typeof(event) == 'object') {
	    /* We're using new style API.*/
	    options = $.extend({}, default_options, event);
	    options['original_this'] = this;
	    return this.live(options['event'], function(e) {
		e.preventDefault();
		$.pyproxy_call(options);
	    });
	}

	// Old style API - should be removed in 1.0.
	return this.live(event, function(e) {
	    e.preventDefault();
	    $.pyproxy_call(url, data, callback, this);
	});
    };
})(jQuery);
