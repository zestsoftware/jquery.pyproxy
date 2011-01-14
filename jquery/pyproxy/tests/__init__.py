# We can not use the same test suite for Django and Plone.
# So the test suite from Plone is called test_plone.py and is automatically
# loaded as its name starts with 'test'.
# For django, it needs to be imported in this file. We only do it if django
# can be imported.
try:
    import django
except ImportError:
    django = None

if django is not None:
    from django_tests import __test__
else:
    # We are not in a django site, or a weirdly configured one.
    pass
