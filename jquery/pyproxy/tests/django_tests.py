import os
import doctest
from unittest import TestSuite

from jquery.pyproxy import base, utils

OPTIONFLAGS = (doctest.ELLIPSIS |
               doctest.NORMALIZE_WHITESPACE)

__test__ = {
    'base': doctest.testmod(
        m=base,
        optionflags=OPTIONFLAGS),

    'utils': doctest.testmod(
        m=utils,
        optionflags=OPTIONFLAGS),

    'readme': doctest.testfile(
        "../../../README.rst",
        optionflags=OPTIONFLAGS),
    }
