# Simple library to map JQuery methods in Python code.
from types import NoneType
import simplejson as json

import imp
import os


def custom_endswith(str, ext_list):
    """ Python 2.4 do not accept a list/tuple for
    endswith. So we build a custom one.
    """
    for ext in ext_list:
        if str.endswith(ext):
            return True

    return False

# Code taken from here:
# http://stackoverflow.com/questions/487971/is-there-a-standard-way-to-list-names-of-python-modules-in-a-package
MODULE_EXTENSIONS = ['.py', '.pyc', '.pyo']
def package_contents():
    from jquery.pyproxy import plugins as plugin_module
    folder = '/'.join(plugin_module.__file__.split('/')[:-1])
    # Use a set because some may be both source and compiled.
    return ['.'.join(module.split('.')[:-1])
            for module in os.listdir(folder)
            if custom_endswith(module, MODULE_EXTENSIONS) and
            not module.startswith('__')]


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

        object.__getattribute__(self, name)


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
        return '%s %s' % (self.method, self.args)

class JQueryProxy(object):
    grammar = {}

    def __init__(self):
        self.selectors = []
        self.calls = []

        # We build the grammar from the plugins.
        plugins = package_contents()
        for plugin in plugins:
            try:
                exec 'from jquery.pyproxy.plugins.%s import grammar' % plugin
                self.extend_grammar(grammar)
                    
            except ImportError:
                pass

    def extend_grammar(self, grammar):
        for meth in grammar:
            if meth in self.grammar:
                # We try to avoid clashes.
                continue
            
            self.grammar[meth] = grammar[meth]

    def __call__(self, selector = ''):
        self.selectors.append(selector)
        
        self.calls.append(JQueryCommand(self.grammar))
        return self.calls[-1]

    def hide_errors(self, errors):
        """ Take a list of ids, removes the 'errormessage' class
        and adds the 'dont-show' one.
        """
        for err in errors:
            self('#' + err).removeClass('errormessage')
            self('#' + err).addClass('dont-show')

    def show_errors(self, errors):
        """ Does the opposite of hide_errors.
        """
        for err in errors:
            self('#' + err).addClass('errormessage')
            self('#' + err).removeClass('dont-show')

    def json_serializable(self):
        """ Returns content as simple types so we can use simplejson.

        Results looks like this:
        [{'selector': '#my_id',
          'command': 'html',
          'args': ['blabla']},
          ...
        ]
        """
        res = []
        for i in range(0, len(self.selectors)):
            command = {}
            command['selector'] = self.selectors[i]
            command['call'] = self.calls[i].method
            command['args'] = self.calls[i].args
            res.append(command)
        return res

def clean_string(str):
    """ Removes characters that can cause Javascript evaluation problems.
    We might use regexp if the list grows too much, but for the moment
    simple replace are okay.
    """
    replacements = {'\n': '\\n',
                    '\r': '\\r',
                    '\t': '',
                    '\'': '\\\''}

    for key in replacements:
        str = str.replace(key, replacements[key])

    return str
