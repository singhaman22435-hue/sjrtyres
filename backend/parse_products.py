import re

with open(r"d:\SRJtyres\frontend\src\productsData.js", "r", encoding="utf-8") as f:
    content = f.read()

categories = set(re.findall(r'"category":\s*"([^"]+)"', content))
fitments = set(re.findall(r'"fitment":\s*"([^"]+)"', content))
brands = set(re.findall(r'"brand":\s*"([^"]+)"', content))

print("CATEGORIES:", list(categories))
print("FITMENTS:", list(fitments))
print("BRANDS:", list(brands))
