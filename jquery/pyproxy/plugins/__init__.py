# This package lists the commands that can be recognized
# by JQueryProxy objects.

# The list of available commands are stored as a dictionnary.
# The key is the method name.
# The value is the list of arguments it takes.
# For example, the 'html' method takes one argument, that can be a
# string or a unicode.
# So we declare grammar['html'] = [STR_TYPE]
#
# If we have a function that takes a string and a dictionary as argument:
# grammar['myfunc'] = [str, dict]
#
# If we have a function which takes a string and an optional string
# argument:
# grammar['optional'] = [str, [str, NoneType]]
#
# Note: you could write something like this:
# available['dummy'] = [str, [unicode, NoneType], dict]
# but that would be stupid as the second parameter would be optional
# and not the third one. So don't ...

