module('pyproxy_call - old api');

asyncTest('Using static empty JSON files as input', function() {
    /* We clean content of the extra loader as some elements might still be changing */
    jq1('#pyproxy_tests_extras').empty();

    /* We also remove the spinner */
    var spinner = jq1('#pyproxy_spinner');
    var spinner_content = spinner.html();
    spinner.remove();

    var body_content = jq1('body').html();
    jq1.pyproxy_call('pyproxy_json_test1',
		     {},
		     function() {
			 equal(jq1('body').html(),
			       body_content,
			       'The body was not modified');
			 start();
			 jq1('body').append('<div id="pyproxy_spinner"></div>');
			 jq1('#pyproxy_spinner').html(spinner_content).hide();
		     });
});

asyncTest('Using static JSON files as input', function() {
    jq1.pyproxy_call('pyproxy_json_test2',
		     {},
		     function() {
			 equal(jq1('#test_div_json').html(),
			       'Some text',
			       'The JSON instructions added a new div to the body');
			 start();
		     });
});

asyncTest('Using with a @jquery view doing nothing', function(){
    /* We clean content of the extra loader as some elements might still be changing */
    jq1('#pyproxy_tests_extras').empty();

    /* We also remove the spinner */
    var spinner = jq1('#pyproxy_spinner');
    var spinner_content = spinner.html();
    spinner.remove();

    var body_content = jq1('body').html();
    jq1.pyproxy_call('pyproxy_sample_do_nothing',
		     {},
		     function() {
			 equal(jq1('body').html(),
			       body_content,
			       'The body was not modified');
			 start();
			 jq1('body').append('<div id="pyproxy_spinner"></div>');
			 jq1('#pyproxy_spinner').html(spinner_content).hide();
		     });
});


asyncTest('Using with a @jquery view returning the form casted as a string - no form defined', function(){
    jq1.pyproxy_call('pyproxy_sample_form_to_string',
		     function() {
			 equal(jq1('#pyproxy_tests_form_holder').html(),
			       '{}',
			       'No POST data were sent');
			 start();
		     });
});

asyncTest('Using with a @jquery view returning the form casted as a string - JS defined form', function(){
    jq1.pyproxy_call('pyproxy_sample_form_to_string',
		     {'first_value': 42,
		      'second_value': 'A string',
		      'third_value': ['a', 'list']},
		     function() {
			 equal(jq1('#pyproxy_tests_form_holder').html(),
			       "{'third_value': ['a', 'list'], 'first_value': '42', 'second_value': 'A string'}",
			       'Our form was correctly sent - the integer was casted into a string');
			 start();
		     });
});

asyncTest('Using with a @jquery view returning the form casted as a string - using a selector (the empty form)', function(){
    jq1.pyproxy_call('pyproxy_sample_form_to_string',
		     '#qunit_form_sample_empty_elements',
		     function() {
			 equal(jq1('#pyproxy_tests_form_holder').html(),
			       "{'empty_textarea': '', 'empty_hidden': '', 'empty_text': '', 'empty_password': '', 'empty_submit': '', 'empty_select': 'null', 'empty_multi_select': 'null'}",
			       'We get the same result than previously');
			 start();
		     });
});

asyncTest('Using with a @jquery view returning the form casted as a string - using a selector (the valued form)', function(){
    jq1.pyproxy_call('pyproxy_sample_form_to_string',
		     '#qunit_form_sample_valued_elements',
		     function() {
			 equal(jq1('#pyproxy_tests_form_holder').html(),
			       "{'valued_hidden': 'hidden_value', 'two_valued_checkbox': ['2', '3'], 'valued_select': '3', 'valued_multi_select': ['1', '3'], 'valued_password': 'mys3cr3tpassword', 'valued_radio': '3', 'valued_textarea': 'There can be a lot in here', 'valued_checkbox': '2', 'valued_submit': 'To infinity and beyond', 'valued_text': \"I'm a text field\"}",
			       'Again, the same values are send than when testing form_to_dict');
			 start();
		     });
});

asyncTest('Using "this" in a pyproxy_call', function() {
    jq1('#pyproxy_call_this').each(
	function() {
	    jq1.pyproxy_call('pyproxy_sample_replace_this_content',
			     {},
			     function() {
				 equal(jq1('#pyproxy_call_this').html(),
					   'Content replaced');
				 start();
			     },
			     this);
	});
});

module('pyproxy - old api');

asyncTest('Binding "pyproxy" to a link element - no form sent', function(){
    /* We're not using a submit button as the preventDefault is not taken into account ...*/
    jq1('#pyproxy_tests_extras').append('<a href="#" id="test_empty_form_trigger">Let\'s send nothing</a>');
    var submit = jq1('#test_empty_form_trigger');
    submit.pyproxy('click',
		   'pyproxy_sample_form_to_string',
		   function() {
		       equal(jq1('#pyproxy_tests_form_holder').html(),
			     "{}");
		       start();
		   });

    submit.trigger('click');
});

asyncTest('Binding "pyproxy" to a link element - sending a form with ignored elements', function(){
    /* We're not using a submit button as the preventDefault is not taken into account ...*/
    jq1('#pyproxy_tests_extras').append('<a href="#" id="test_empty_form_trigger_ignored">Let\' send something</a>');
    var submit = jq1('#test_empty_form_trigger_ignored');
    submit.pyproxy('click',
		   'pyproxy_sample_form_to_string',
		   '#qunit_form_sample_ignored_elements',
		   function() {
		       equal(jq1('#pyproxy_tests_form_holder').html(),
			     "{'not_ignored_submit': 'Submit'}");
		       start();
		   });
    submit.trigger('click');
});

asyncTest('Binding a function using "this"', function() {
    var link = jq1('a#pyproxy_this');
    link.pyproxy('click',
		 'pyproxy_sample_replace_this_content',
		 function() {
		     equal(link.html(), 'Content replaced');
		     start();
		 });
    link.trigger('click');
});

asyncTest('Binding a function using "this" - only the current element is replaced', function() {
    var link = jq1('a#pyproxy_multi_this');
    var link1 = jq1('a#pyproxy_multi_this1');
    jq1('a.pyproxy_multi_this').pyproxy('click',
					'pyproxy_sample_replace_this_content',
					function() {
					    equal(link.html(), 'Content replaced');
					    equal(link1.html(), '');
					    start();
					});
    link.trigger('click');
});


asyncTest('Chaining calls', function() {
    var link = jq1('a#chained_calls_trigger');
    link.pyproxy('click',
		 'pyproxy_sample_chained_calls',
		 function() {
		     equal(link.parent().find('span').hasClass('my_new_class'), true);
		     start();
		 });
    link.trigger('click');
});