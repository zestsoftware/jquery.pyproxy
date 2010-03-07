var pyproxy_debug_mode = false;

(function($) {
    debug = function(msg) {
	if (pyproxy_debug_mode) {
	    console.log(msg);
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

	/*
	 * Transforms a form into a dictionnary that can be sent
	 * to the Ajax call.
	 */
	form_to_dict = function() {
	    inputs = $(form_id + ' :input');
	    dict = {};

	    for (i=0; i<inputs.length; i++) {
		input = inputs[i];
		add = false;
		name = String(input.name);

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

	/* Transforms an argument from the JSon response to a string.
	 * For example, this list: ['a', 2, {'z': 'x'}] will be transformed to
	 * "'a', 2, {'z': 'x'}"
	 * Yes it looks almost the same.
	 */
	function arg_to_string(arg) {
	    if (typeof(arg) == 'string') {
		res = '\'' + arg + '\'';
	    } else if (typeof(arg) == 'number') {
		res = arg;
	    } else {
		/* If it's not a String, not an integer, must be a dict.
		 * Yes it's a huge assumption, but there is not that much 
		 * possible parameter type in JQuery.
		 */
		res = '{';
	    
		for (key in arg) {
		    res += '\'' + key + '\': ' + arg_to_string(arg[key]) + ', ';
		}
	    
		/* IE do not like dictionnaries written like this {'a': 2,}, so
		   we have to remove the last comma. */
		res = res.slice(0, -2) + '}';
	    }

	    return res;
	}

	/* Process the data  */
	function process_data(data) {
	    debug('Processing data ...');
	    for (i=0; i < data.length; i++) {
		command = data[i];
	    
		ex = '$(\'' + command.selector + '\').' + command.call + '(';
	    
		for (j = 0; j < command.args.length; j++) {
		    arg = command.args[j];
		
		    ex += arg_to_string(arg);
		    if (j+1 < command.args.length) {
			ex += ', ';
		    }
		}
	    
		ex += ')';

		debug(ex);
		eval(ex);
	    }

	    if (typeof(callback) == 'function') {
		callback(data);
	    }
	};

	if (typeof(data) == 'undefined') {
	    data = {};
	}
	else if (typeof(data) == 'string') {
	    form_id = data;
	    data = form_to_dict(this);
	}

	return $.ajax({type: 'POST',
		       url: url,
		       data: data,
		       success: process_data,
		       dataType: "json"});
    };


    /*
     * $('#something').pyproxy(event, url, [data, [callback]])
     * Binds a call to pyproxy_call with the provided event for
     * items matching the selctor.
     * You must use events that can be used with 'live'.
     */   
    $.fn.pyproxy = function(event, url, data, callback) {
	make_call = function() {
	    $.pyproxy_call(url, data, callback)
	}

	debug('Binded event \'' + event + '\' on \'' + this.selector + '\' to call \'' + url + '\'')
	return this.live(event, make_call);
    };
})(jQuery);
