from django.http import HttpResponse
import simplejson as json

from base import JQueryProxy

def jquery(function):
    """ The @jquery decorator can be added to a function
    that returns a JQuery object.
    This method will return the JQuery object serialized as a
    JSON string.
    """
    def _jquery(*args, **kwargs):
        jq = function(*args, **kwargs)
        if jq:
            res = json.dumps(jq.json_serializable())
        else:
            res = ''
        return HttpResponse(res)
    return _jquery

