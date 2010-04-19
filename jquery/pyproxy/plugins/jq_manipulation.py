from types import NoneType
# JQuery manipulation API.
STR_TYPE = [str, unicode]

grammar = {'addClass': [STR_TYPE],
           'after': [STR_TYPE],
           'append': [STR_TYPE],
           'appendTo': [STR_TYPE],
           'attr': [STR_TYPE, [str, unicode, int, float]],
           'before': [STR_TYPE],
           'css': [[str, unicode, dict], [str, unicode, NoneType]],
           'detach': [STR_TYPE],
           'empty': [],
           'html': [STR_TYPE],
           'insertAfter': [STR_TYPE],
           'insertBefore': [STR_TYPE],
           'prepend': [STR_TYPE],
           'prependTo': [STR_TYPE],
           'remove': [[str, unicode, NoneType]],
           'removeAttr': [STR_TYPE],
           'removeClass': [[str, unicode, NoneType]],
           'replaceAll': [[str, unicode, NoneType]],
           'replaceWith': [STR_TYPE],
           'text': [STR_TYPE],
           'toggleClass': [STR_TYPE, [bool, NoneType]],
           'unwrap': [],
           'wrap': [STR_TYPE],
           'wrapAll': [STR_TYPE],
           'wrapInner': [STR_TYPE]}
