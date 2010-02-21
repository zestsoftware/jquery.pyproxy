/*
 * Simple JQuery/Python proxy.
 */

function form_to_dict(form_id) {
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
	eval(ex);

    }
}

/* The main function of the system (and the only one you should call)
 * - url is the url of the python page that will do the work
 * If data is undefined, nothing will be sent.
 * If data is a string, the method will consider it's the selector of the form
 * that shall be submitted.
 * If data is a dictionnary, then we use it.
 *
 * You can provide a callback function used when data are received. By default, we use
 * the process_data as a callback.
 * If you define a custom callback, do not forget to call process_data in it if you want
 * the jquery code defined on server side to be executed.
 */
function jq_proxy(url, data, callback) {
    if (typeof(data) == 'undefined') {
	data = {};
    }
    else if (typeof(data) == 'string') {
	data = form_to_dict(data);
    }

    if (typeof(callback) == 'undefined') {
	callback = process_data
    }    

    $.ajax({type: 'POST',
		url: url,
		data: data,
		success: callback,
		dataType: "json"});

}

/* The Javascript code to associate actions and jquery proxies will almost
 * always be the same:
 * jq(selector).live('click', function() {jq_proxy(url, form_id); return false;})
 * This method will simplify it, by taking a list of all actions to bind.
 * For example, settings can be:
 * [{'selector': '#my_selector',
 *   'action': 'click',
 *   'url': 'http://....',
 *   'form': '#my_form', // see data description in jq_proxy.
 *   'return_value': false},
 *   another dictionnary ...
 * ]
 *
 * Action must be a trigger that can be binded with JQuery 'live' method.
 */
function jq_proxy_batch(settings) {
    for (i=0; i<settings.length; i++){
	command = settings[i];

	/* We have to use string evaluation. It's less clear and kind of ugly,
	 * but creating the command more classicly sometime breaks.
	 */
	ex = '$(\'' + command.selector + '\').live(\'' +  command.action + '\', function() {jq_proxy(\'' + command.url + '\', \'' + command.form + '\'); return ' + command.return_value + '; });'
	eval(ex);
    }
}
