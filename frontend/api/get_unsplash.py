import urllib.request
import json

def get_unsplash(query):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page=1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        return res['results'][0]['urls']['regular']
    except Exception as e:
        print(f"Error {query}: {e}")
    return None

import urllib.parse
print("Raw Material:", get_unsplash("rubber factory"))
print("Extrusion:", get_unsplash("industrial machine"))
print("Curing:", get_unsplash("factory sparks"))
print("Quality Control:", get_unsplash("quality control engineer"))
print("Dispatch:", get_unsplash("logistics warehouse"))
