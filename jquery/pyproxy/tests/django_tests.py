import doctest
from django.utils import unittest

from jquery.pyproxy import base, utils

OPTIONFLAGS = (doctest.ELLIPSIS |
               doctest.NORMALIZE_WHITESPACE)

testmods = {'base': base,
            'utils': utils}
testfiles = {'readme': '../../../README.rst',
             'django': 'django.txt'}


def suite():
    return unittest.TestSuite(
        [doctest.DocTestSuite(mod, optionflags = OPTIONFLAGS)
         for mod in testmods.values()] +
        [doctest.DocFileSuite(f, optionflags = OPTIONFLAGS)
         for f in testfiles.values()])
