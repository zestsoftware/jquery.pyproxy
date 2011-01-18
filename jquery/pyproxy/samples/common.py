# Sample functons that can be used from Django or Plone.

def add_list_element(jq):
    """ Adds an element to the list with id 'pyproxy_sample_1_container'
    """
    jq('#pyproxy_sample_1_container').append(
        '<li>An element added by pyproxy</li>')
    return jq

def add_list_element_2(jq, text):
    """ Adds an element to the list with id 'pyproxy_sample_1_container'.
    This one accepts a extra parameter to specify the added text.
    """
    jq('#pyproxy_sample_2_container').append(
        '<li>%s</li>' % text)
    return jq

def link_generator(jq):
    links = {'jQuery': 'http://www.jquery.com',
             'Plone': 'http://www.plone.org',
             'Django': 'http://www.djangoproject.org',
             'pyproxy': 'https://github.com/vincent-psarga/jquery.pyproxy/'}
    
    jq('#sample_4_container').html('<br />'.join(['<a href="%s">%s</a>' % (href, name)
                                                  for name, href in links.items()]))
    return jq
