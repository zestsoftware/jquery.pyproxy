from jquery.pyproxy.jq_django import JQueryProxy, jquery


@jquery
def sample(request, p):
    """ Simple view hiding nodes with the class 'myclass' if p is True.
    """
    if not p:
        return

    jq = JQueryProxy()
    jq('.myclass').show()
    return jq
