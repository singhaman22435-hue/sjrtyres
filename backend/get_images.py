import urllib.request
import re
import json

def get_unsplash_image(query):
    url = f"https://unsplash.com/s/photos/{query}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Find images.unsplash.com/photo-XXXXX
        matches = re.findall(r'images\.unsplash\.com/photo-([a-zA-Z0-9\-]+)\?', html)
        if matches:
            return f"https://images.unsplash.com/photo-{matches[0]}?auto=format&fit=crop&q=80&w=800"
    except Exception as e:
        print(f"Error fetching {query}: {e}")
    return None

results = {
    "tractor": get_unsplash_image("tractor"),
    "truck": get_unsplash_image("semi-truck"),
    "mining": get_unsplash_image("mining-truck"),
    "motorcycle": get_unsplash_image("motorcycle")
}

print(json.dumps(results, indent=2))
