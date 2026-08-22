import fitz  # PyMuPDF
import json
import os
import re

PDF_PATH = r"d:\SRJtyres\frontend\src\sjr catlog.pdf"
OUT_IMG_DIR = r"d:\SRJtyres\frontend\public\tyre images\catalog"
OUT_JSON = r"d:\SRJtyres\frontend\src\extracted_products.json"

os.makedirs(OUT_IMG_DIR, exist_ok=True)

print(f"Loading PDF from: {PDF_PATH}")
doc = fitz.open(PDF_PATH)
products = []

for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text = page.get_text("text")
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    if not lines:
        continue
        
    # Attempt to extract category and name
    category = lines[0] if len(lines) > 0 else "Unknown Category"
    name = lines[1] if len(lines) > 1 else f"Product {page_num+1}"
    
    # Attempt to extract features
    features = []
    in_desc = False
    for line in lines:
        if "PRODUCT DESCRIPTION" in line.upper():
            in_desc = True
            continue
        if in_desc:
            # Clean up bullet points (dots, circles, etc)
            cleaned = re.sub(r'^[\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+', '', line).strip()
            if cleaned and "!" not in cleaned and "www" not in cleaned.lower():
                features.append(cleaned)
                
    # Extract Image
    images = page.get_images(full=True)
    best_image = None
    max_size = 0
    
    for img_idx, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        
        # The largest image is typically the tyre, not the background/logo
        if len(image_bytes) > max_size:
            max_size = len(image_bytes)
            best_image = base_image
            
    img_filename = f"default.png"
    if best_image:
        ext = best_image["ext"]
        # Make a safe filename from the product name
        safe_name = "".join([c if c.isalnum() else "_" for c in name])
        # Shorten if too long
        safe_name = safe_name[:30]
        img_filename = f"tyre_{page_num+1}_{safe_name}.{ext}"
        img_path = os.path.join(OUT_IMG_DIR, img_filename)
        
        with open(img_path, "wb") as f:
            f.write(best_image["image"])
            
    # Determine basic fitment
    fitment = "Universal"
    cat_upper = category.upper()
    if "FRONT" in text.upper() or "FRONT" in name.upper(): fitment = "Front"
    elif "REAR" in text.upper() or "REAR" in name.upper(): fitment = "Rear"
            
    # Add to list
    products.append({
        "id": 2000 + page_num,
        "name": name,
        "category": category.title(),
        "fitment": fitment,
        "brand": "SJR Tyres",
        "applications": features[:6], # Keep max 6 features
        "image": f"/tyre images/catalog/{img_filename}",
        "description": f"Premium {category.title()} designed for optimal performance.",
        "specs": {
            "loadCapacity": "N/A",
            "maxSpeed": "N/A",
            "rimSize": "N/A",
            "pressure": "N/A"
        },
        "metrics": {
            "traction": 85,
            "durability": 90,
            "fuelEfficiency": 80,
            "comfort": 85
        }
    })
    print(f"Extracted Page {page_num+1}: {name} ({len(features)} features)")

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2)
    
print(f"\n✅ Extraction complete! Extracted {len(products)} products.")
print(f"✅ Images saved to: {OUT_IMG_DIR}")
print(f"✅ Data saved to: {OUT_JSON}")
