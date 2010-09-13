from types import NoneType
# JQuery effect API.

grammar = {'show': [[str, unicode, int, NoneType]],
           'hide': [[str, unicode, int, NoneType]],
           'toggle': [[str, unicode, int, NoneType]],
           'slideDown': [[str, unicode, int]],
           'slideUp': [[str, unicode, int]],
           'slideToggle': [[str, unicode, int]],
           'fadeIn': [[str, unicode, int]],
           'fadeOut': [[str, unicode, int]],
           'fadeTo': [[str, unicode, int], int],
           'animate': [dict, [str, unicode, int, NoneType], [str, NoneType]]}
