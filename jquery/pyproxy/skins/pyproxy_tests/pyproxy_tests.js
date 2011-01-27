test("Check that pyproxy is loaded correctly", function() {
    equal(typeof(jq1.pyproxy_call), 'function', 'We can use jq.pyproxy_call');
    equal(typeof(jq1().pyproxy), 'function', 'We can use jq().pyproxy');
});

module('pyproxy form to dict');

test('With an empty form', function() {
    deepEqual(jq1.pyproxy_form_to_dict('#qunit_empty_form'),
	      {},
	      'Test empty form');
});

test('Using empty elements', function() {
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_hidden'),
	      {'empty_hidden': ''},
	      'Test empty hidden');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_text'),
	      {'empty_text': ''},
	      'Test empty text');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_password'),
	      {'empty_password': ''},
	      'Test empty password');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_textarea'),
	      {'empty_textarea': ''},
	      'Test empty textarea');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_checkbox'),
	      {},
	      'Test empty checkbox');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_radio'),
	      {},
	      'Test empty radio');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_select'),
	      {'empty_select': null},
	      'Test empty select');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_multi_select'),
	      {'empty_multi_select': null},
	      'Test empty multi select');
    deepEqual(jq1.pyproxy_form_to_dict('#field_empty_submit'),
	      {'empty_submit': ''},
	      'Test empty submit');
    deepEqual(jq1.pyproxy_form_to_dict('#qunit_form_sample_empty_elements'),
	      {'empty_hidden': '',
	       'empty_text': '',
	       'empty_password': '',
	       'empty_textarea': '',
	       'empty_select': null,
	       'empty_multi_select': null,
	       'empty_submit': ''},
	      'Test full empty form');
});

test('Using valued elements', function() {
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_hidden'),
	      {'valued_hidden': 'hidden_value'},
	      'Test valued hidden');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_text'),
	      {'valued_text': "I'm a text field"},
	      'Test valued text');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_password'),
	      {'valued_password': 'mys3cr3tpassword'},
	      'Test valued password');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_textarea'),
	      {'valued_textarea': 'There can be a lot in here'},
	      'Test valued textarea');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_checkbox'),
	      {'valued_checkbox': ['2']},
	      'Test valued checkbox');
    deepEqual(jq1.pyproxy_form_to_dict('#field_two_valued_checkbox'),
	      {'two_valued_checkbox': ['2', '3']},
	      'Test valued checkbox with two elements checked');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_radio'),
	      {'valued_radio': '3'},
	      'Test valued radio');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_select'),
	      {'valued_select': '3'},
	      'Test valued select');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_multi_select'),
	      {'valued_multi_select': ['1', '3']},
	      'Test valued multi select');
    deepEqual(jq1.pyproxy_form_to_dict('#field_valued_submit'),
	      {'valued_submit': 'To infinity and beyond'},
	      'Test valued submit');
    deepEqual(jq1.pyproxy_form_to_dict('#qunit_form_sample_valued_elements'),
	      {'valued_hidden': 'hidden_value',
	       'valued_text': 'I\'m a text field',
	       'valued_password': 'mys3cr3tpassword',
	       'valued_textarea': 'There can be a lot in here',
	       'valued_checkbox': ['2'],
	       'two_valued_checkbox': ['2', '3'],
	       'valued_radio': '3',
	       'valued_select': '3',
	       'valued_multi_select': ['1', '3'],
	       'valued_submit': 'To infinity and beyond'},
	      'Test full valued form');
});

test('Ignoring some elements', function() {
    deepEqual(jq1.pyproxy_form_to_dict('#qunit_form_sample_ignored_elements'),
	      {'not_ignored_submit': 'Submit'},
	      'The value of the cancel submit does not appear');
});

module('pyproxy_process_data');

test('Empty data set', function() {
    var page_content = jq1('body').html();
    jq1.pyproxy_process_data([]);
    equal(page_content,
	  jq1('body').html(),
	  'Nothing has changed');
});

test('A call without arguments', function() {
    jq1('#pyproxy_tests_extras').append('<div id="test_content_deleted">Ho noes, I will disappear :(</div>');
    equal(jq1('#test_content_deleted').html(),
	  'Ho noes, I will disappear :(',
	  'The content has been created correctly');

    jq1.pyproxy_process_data([{'selector': '#test_content_deleted',
			       'call': 'empty',
			       'args': []}]);

    equal(jq1('#test_content_deleted').html(),
	  '',
	  'The content has been deleted by the call to "empty"');
});

test('Call with a single string argument', function() {
    jq1('#pyproxy_tests_extras').append('<div id="test_content_added"></div>');
    equal(jq1('#test_content_added').html(),
	  '',
	  'The div does not have any content');
    jq1.pyproxy_process_data([{'selector': '#test_content_added',
			       'call': 'html',
			       'args': ["Let's put some stuff in this div"]}]);
    equal(jq1('#test_content_added').html(),
	  "Let's put some stuff in this div",
	  'The content has been added by the call to "html" with a single string argument');
});

test('Call with a single number argument', function() {
    jq1('#pyproxy_tests_extras').append('<div id="test_div_fadded">I will be hidden soon</div>');

    match(String(jq1('#test_div_fadded').attr('style')),
	  /^(undefined|)$/,
	  'The div does not have anything in the "style" attribute');

    jq1.pyproxy_process_data([{'selector': '#test_div_fadded',
			       'call': 'fadeOut',
			       'args': [1000]}]);

    match(jq1('#test_div_fadded').attr('style'),
	  /opacity|display/,
	  'The call to "fadeOut" updated the style attribute adding "opacity: xxx" or "display: none"');
});

test('Call with a dict argument', function() {
    jq1('#pyproxy_tests_extras').append('<div id="test_div_cssed">Let\'s get styled</div>');
    match(String(jq1('#test_div_cssed').attr('style')),
	  /^(undefined|)$/,
	  'The div does not have anything in the "style" attribute');

    jq1.pyproxy_process_data([{'selector': '#test_div_cssed',
			       'call': 'css',
			       'args': [{'width': '50%',
					 'margin-top': 15,
					 'background-color': '#154826'}]}]);

    match(jq1('#test_div_cssed').attr('style'),
	  /^((width: 50%|margin-top: 15px|background-color: (rgb\(21, 72, 38\)|#154826));? ?){3}$/i,
	  'The CSS attributes have been added to the "style" attribute');
});

test('Call with multiple arguments', function() {
    jq1('#pyproxy_tests_extras').append('<div id="test_div_attred">My attributes will be updated</div>');
    equal(jq1('#test_div_attred').attr("class"),
	  "",
	  'The div does not have anything in the "class" attribute');

    jq1.pyproxy_process_data([{'selector': '#test_div_attred',
			       'call': 'attr',
			       'args': ['class', 'discreet']}]);

    equal(jq1('#test_div_attred').attr("class"),
	  'discreet',
	  'The div now have the "discreet" class, added using "attr()"');

});

test('Check that the callback is correctly called', function() {
    jq1.pyproxy_process_data([{'selector': '#pyproxy_tests_extras',
			       'call': 'append',
			       'args': ['<div id="test_div_callback"></div>']}],
			       function(d) {
				   jq1('#test_div_callback').html('Content added by callback');
			       });
    equal(jq1('#test_div_callback').html(),
	  'Content added by callback',
	  'The callback was called, adding content to the div created by process_data');
});

module('pyproxy_call');

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

module('pyproxy');

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