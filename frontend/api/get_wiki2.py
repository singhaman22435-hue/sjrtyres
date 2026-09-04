import urllib.request
import urllib.parse
import json

def get_wiki_image(query):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        pages = res['query']['pages']
        for page_id in pages:
            if 'original' in pages[page_id]:
                return pages[page_id]['original']['source']
    except Exception as e:
        print(f"Error {query}: {e}")
    return None

print("Tractor:", get_wiki_image("John Deere 9630"))
print("Mining:", get_wiki_image("Caterpillar 797"))
