# Simple library to map JQuery methods in Python code.
from types import NoneType

from jquery.pyproxy.utils import package_contents

class JQueryCommand(object):
    """ An object storing JQuery commands done.
    """
    def __init__(self, grammar = {}):
        self.method = ''
        self.args = []
        self.grammar = grammar

    def __getattr__(self, name):
        """ We override __getattr__ so we can automate some code, as
        all mapped functions will do the same (check arguments, save them).
        If the method called is in the list of our maped function, we call
        the call method that will check the arguments using what's described
        in grammar.
        """
        if name in self.grammar:
            self.method = name
            return self.call

        return object.__getattribute__(self, name)

    def call(self, *args, **kwargs):
        """ Check the arguments provided are corrects toward grammar
        and stores them.
        """
        # We check that arguments are correct.
        # Note: we do not support named arguments (yet ?)
        expected_args = self.grammar[self.method]

        # We compute the minimum and maximum number of arguments expected.
        max_args = len(expected_args)
        min_args = 0        
        for arg in expected_args:
            # If we find a list containing NoneType, we stop the loop
            # as we found the first optionnal parameter.
            # All parameter after this one should be optionals.
            if type(arg) == list:
                if NoneType in arg:
                    break
            min_args += 1

        # We check that the number of arguments is correct
        if len(args) > max_args or \
               len(args) < min_args:
            if max_args == 0:
                raise TypeError(
                    "Method '%s' does not take any argument" %
                    self.method)
            elif min_args == max_args:
                raise TypeError(
                    "Method '%s' takes exactly %s arguments" %
                    (self.method, min_args))
            else:
                raise TypeError(
                    "Method '%s' takes between %s and %s arguments" %
                    (self.method, min_args, max_args))

        # We check that each argument as the correct type.
        i = 0
        for arg in args:
            expected = expected_args[i]

            if type(expected) == list:
                if not type(arg) in expected:
                    raise TypeError(
                        "Argument %s of method %s must have one of the following types: %s" %
                        (i + 1, self.method, expected))
            elif expected != type(arg):
                raise TypeError(
                    "Argument %s of method %s must be: %s" %
                    (i + 1, self.method, expected))                       
            i += 1

        # If no error has been found, we can save the arguments.
        self.args = list(args)

    def __str__(self):
        """ Returns the method called and the arguments used.

        >>> jq = JQueryProxy()
        >>> jq('a').css({'text-decoration': 'underline'})
        >>> str(jq.calls[-1])
        "css({'text-decoration': 'underline'})"
        """
        return '%s(%s)' % (self.method,
                           str(self.args)[1:-1])
    def __repr__(self):
        """ See __str__

        >>> jq = JQueryProxy()
        >>> jq('a').css({'text-decoration': 'underline'})
        >>> jq.calls[-1]
        css({'text-decoration': 'underline'})
        """
        return str(self)

class JQueryProxy(object):
    base_grammar = {}

    def __init__(self):
        self.selectors = []
        self.calls = []
        self.grammar = {}

        self.extend_grammar(self.base_grammar)

        # We build the grammar from the plugins.
        plugins = package_contents()
        for plugin in plugins:
            try:
                exec 'from jquery.pyproxy.plugins.%s import grammar' % plugin
                self.extend_grammar(grammar)

            except ImportError:
                # This should only happen when a plugin does not define a
                # 'grammar' dictionnary.
                pass

    def extend_grammar(self, grammar):
        """ Adds new elements to the known grammar of the object.

        >>> jq = JQueryProxy()
        >>> sorted(jq.grammar.keys())
        ['addClass', 'after', 'animate', 'append',
         'appendTo', 'attr', 'before', 'css', 'detach',
         'empty', 'fadeIn', 'fadeOut', 'fadeTo', 'hide',
         'html', 'insertAfter', 'insertBefore', 'prepend',
         'prependTo', 'remove', 'removeAttr', 'removeClass',
         'replaceAll', 'replaceWith', 'show', 'slideDown',
         'slideToggle', 'slideUp', 'text', 'toggle', 'toggleClass',
         'unwrap', 'wrap', 'wrapAll', 'wrapInner']

        >>> jq.extend_grammar({'a_new_method': []})
        >>> sorted(jq.grammar.keys())
        ['a_new_method', 'addClass', 'after', 'animate', 'append',
         'appendTo', 'attr', 'before', 'css', 'detach', 'empty', 'fadeIn',
         'fadeOut', 'fadeTo', 'hide', 'html', 'insertAfter', 'insertBefore',
         'prepend', 'prependTo', 'remove', 'removeAttr', 'removeClass',
         'replaceAll', 'replaceWith', 'show', 'slideDown', 'slideToggle',
         'slideUp', 'text', 'toggle', 'toggleClass', 'unwrap', 'wrap',
         'wrapAll', 'wrapInner']

        If a method already exists in the grammar, it is not overriden.
        >>> jq.grammar['animate']
        [<type 'dict'>,
         [<type 'str'>, <type 'unicode'>, <type 'int'>, <type 'NoneType'>],
         [<type 'str'>, <type 'NoneType'>]]

        >>> jq.extend_grammar({'animate': [[int], [str]]})
        >>> jq.grammar['animate']
        [<type 'dict'>,
         [<type 'str'>, <type 'unicode'>, <type 'int'>, <type 'NoneType'>],
         [<type 'str'>, <type 'NoneType'>]]
         """
        for meth in grammar:
            if meth in self.grammar:
                # We try to avoid clashes.
                continue
            
            self.grammar[meth] = grammar[meth]

    def list_calls(self):
        """ Returns the list of calls that have been done.

        >>> jq = JQueryProxy()
        >>> jq('.kikoo').addClass('lolilol')
        >>> jq('.kikoo').show()
        >>> jq.list_calls()
        ["jq('.kikoo').addClass('lolilol')",
         "jq('.kikoo').show()"]
        """
        return ["jq('%s').%s" % (self.selectors[i],
                                 self.calls[i])
                for i in range(0, len(self.selectors))]

    def __call__(self, selector = ''):
        self.selectors.append(selector)
        
        self.calls.append(JQueryCommand(self.grammar))
        return self.calls[-1]

    def batch(self, selectors, meth, args, prefix='', substitution='%s'):
        """ Calls self(selector).meth(args) for each selectors
        in the selectors list.

        >>> jq = JQueryProxy()
        >>> my_errors = ['email', 'title', 'text']

        >>> jq.batch(my_errors, 'addClass', ['error'])
        >>> jq.list_calls()[-3:]
        ["jq('email').addClass('error')",
         "jq('title').addClass('error')",
         "jq('text').addClass('error')"]

        If provided, prefix the selectors with 'prefix' and uses the substitution
        string.
        >>> jq.batch(my_errors, 'addClass', ['error'], prefix='#')
        >>> jq.list_calls()[-3:]
        ["jq('#email').addClass('error')",
         "jq('#title').addClass('error')",
         "jq('#text').addClass('error')"]

        >>> jq.batch(my_errors, 'addClass', ['error'], substitution='#%s_error')
        >>> jq.list_calls()[-3:]
        ["jq('#email_error').addClass('error')",
         "jq('#title_error').addClass('error')",
         "jq('#text_error').addClass('error')"]


        >>> jq.batch(my_errors, 'addClass', ['error'], prefix='#', substitution='%s_error')
        >>> jq.list_calls()[-3:]
        ["jq('#email_error').addClass('error')",
         "jq('#title_error').addClass('error')",
         "jq('#text_error').addClass('error')"]
        """
        for selector in selectors:
            selector = prefix + substitution % selector
            getattr(self(selector), meth)(*args)

    def hide_errors(self, errors):
        """ Take a list of ids, removes the 'errormessage' class
        and adds the 'dont-show' one.
        It has been deprecated as its mainly based on Plone CSS classes,
        the batch method should be used to replace it.

        >>> jq = JQueryProxy()
        >>> jq.hide_errors(['title', 'email'])
        >>> jq.list_calls()
        ["jq('#title').removeClass('errormessage')",
         "jq('#title').addClass('dont-show')",
         "jq('#email').removeClass('errormessage')",
         "jq('#email').addClass('dont-show')"]
        """
        import warnings
        warnings.warn(
            'JQueryProxy.hide_errors will be removed in version 1.0',
        DeprecationWarning)

        for err in errors:
            self('#' + err).removeClass('errormessage')
            self('#' + err).addClass('dont-show')

    def show_errors(self, errors):
        """ Does the opposite of hide_errors and is deprecated for the
        same reasons.

        >>> jq = JQueryProxy()
        >>> jq.show_errors(['title', 'email'])
        >>> jq.list_calls()
        ["jq('#title').addClass('errormessage')",
         "jq('#title').removeClass('dont-show')",
         "jq('#email').addClass('errormessage')",
         "jq('#email').removeClass('dont-show')"]
        """
        import warnings
        warnings.warn(
            'JQueryProxy.show_errors will be removed in version 1.0',
        DeprecationWarning)

        for err in errors:
            self('#' + err).addClass('errormessage')
            self('#' + err).removeClass('dont-show')

    def json_serializable(self):
        """ Returns content as simple types so we can use simplejson.

        >>> jq = JQueryProxy()
        >>> jq('.portal_message').hide()
        >>> jq('.to_animate').animate({'width': '500px',
        ...                            'height': '200px',
        ...                            'top': '100px'},
        ...                           42,
        ...                           'blabla')
        >>> jq.json_serializable()
        [{'args': [], 'call': 'hide', 'selector': '.portal_message'},
         {'args': [{'width': '500px', 'top': '100px', 'height': '200px'}, 42, 'blabla'], 'call': 'animate', 'selector': '.to_animate'}]
        """
        res = []
        for i in range(0, len(self.selectors)):
            command = {}
            command['selector'] = self.selectors[i]
            command['call'] = self.calls[i].method
            command['args'] = self.calls[i].args
            res.append(command)
        return res

def clean_string(s):
    """ Deprecated as it has been moved to utils.

    Just a test to get closer to the 100% of coverage.
    >>> clean_string('Hello')
    'Hello'
    """
    import warnings
    warnings.warn(
        'Clean string is not needed anymore, since eval() has been removed' + \
        ' on JS side',
        DeprecationWarning)
    return s
