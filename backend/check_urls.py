import urllib.request

urls = {
    "tractor": "https://images.unsplash.com/photo-1605810756775-8022797e8870",
    "truck": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7",
    "mining": "https://images.unsplash.com/photo-1578335029315-00c7a523aef5",
    "motorcycle": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"
}

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        print(f"{name}: {res.status}")
    except Exception as e:
        print(f"{name}: Failed - {e}")
