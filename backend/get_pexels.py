import urllib.request
import re

def get_pexels(query):
    url = f"https://www.pexels.com/search/{urllib.parse.quote(query)}/"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        matches = re.findall(r'images\.pexels\.com/photos/\d+/[a-zA-Z0-9\-]+\.jpeg', html)
        if matches:
            return f"https://{matches[0]}?auto=compress&cs=tinysrgb&w=800"
    except Exception as e:
        print(f"Error {query}: {e}")
    return None

import urllib.parse
print("Raw:", get_pexels("rubber"))
print("Factory:", get_pexels("manufacturing machine"))
print("Curing:", get_pexels("sparks welding"))
print("QC:", get_pexels("engineer inspecting"))
print("Logistics:", get_pexels("warehouse logistics"))
