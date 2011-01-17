var pyproxy_debug_mode = false;

(function($) {
    debug = function(msg) {
	if (pyproxy_debug_mode) {
	    console.log(msg);
	}
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
    $.pyproxy_process_data = function(data, callback) {
	for (i=0; i < data.length; i++) {
	    command = data[i];
	    selector = $(command.selector)
	    meth = $(command.selector)[command.call]
	    meth.apply(selector, command.args);
	}
	
	if (typeof(callback) == 'function') {
	    callback(data);
	}
    }

    /*
     * $.pyproxy_call(url, [data, [callback]])
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

    $.pyproxy_call = function(url, data, callback) {
	var form_id = '';

	if (typeof(data) == 'undefined') {
	    data = {};
	}
	else if (typeof(data) == 'string') {
	    form_id = data;
	    data = $.pyproxy_form_to_dict(form_id);
	} else if (typeof(data) == 'function') {
	    callback = data;
	    data = {};
	}

	return $.ajax({type: 'POST',
		       url: url,
		       data: data,
		       success: function(d) {
			   $.pyproxy_process_data(d, callback);
		       },
		       dataType: "json"});
    };

    /*
     * $('#something').pyproxy(event, url, [data, [callback]])
     * Binds a call to pyproxy_call with the provided event for
     * items matching the selctor.
     * You must use events that can be used with 'live'.
     */   
    $.fn.pyproxy = function(event, url, data, callback) {	
	make_call = function(e) {
	    e.preventDefault()
	    $.pyproxy_call(url, data, callback)
	}

	debug('Binded event \'' + event + '\' on \'' + this.selector + '\' to call \'' + url + '\'')
	return this.live(event, make_call);
    };
})(jQuery);
