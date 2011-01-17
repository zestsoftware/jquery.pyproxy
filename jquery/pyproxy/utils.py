import os

def custom_endswith(s, ext):
    """ Python 2.4 do not accept a list/tuple for
    endswith. So we build a custom one.

    It works with tuples
    >>> custom_endswith('module.py', ('.java', '.cpp', '.py', '.cpy'))
    True
    >>> custom_endswith('module.py', ('.java', '.cpp','.cpy'))
    False

    With lists:
    >>> custom_endswith('module.py', ['.java', '.cpp', '.py', '.cpy'])
    True
    >>> custom_endswith('module.py', ['.java', '.cpp', '.cpy'])
    False

    But also with strings and unicode:
    >>> custom_endswith('module.py', '.py')
    True
    >>> custom_endswith('module.py', '.java')
    False
    >>> custom_endswith('module.py', u'.py')
    True
    >>> custom_endswith('module.py', u'.java')
    False

    For the other types, it crashes.
    >>> custom_endswith('module.py', {})
    Traceback (most recent call last):
    ...
    TypeError: Custom endswith only accepts list, tuple or string, found: <type 'dict'>

    """
    if isinstance(ext, str) or isinstance(ext, unicode):
        return s.endswith(ext)

    if isinstance(ext, list) or isinstance(ext, tuple):
        for e in ext:
            if s.endswith(e):
                return True
    else:
        msg = 'Custom endswith only accepts list, tuple or string, found: %s'
        raise TypeError(msg % type(ext))
            
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
