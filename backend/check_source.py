import urllib.request
url = "https://source.unsplash.com/1600x900/?factory"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req)
    print(res.url)
except Exception as e:
    print(e)
