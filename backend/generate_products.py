import os
import json
import re
from docx import Document

BASE_DIR = r"d:\SRJtyres\frontend\public\tyre images"
OUTPUT_FILE = r"d:\SRJtyres\frontend\src\productsData.js"

def parse_docx(filepath):
    details = {
        "name": "",
        "description": "",
        "loadCapacity": "N/A",
        "rimSize": "N/A",
        "maxSpeed": "N/A",
        "pressure": "N/A"
    }
    try:
        doc = Document(filepath)
        text = "\n".join([p.text.strip() for p in doc.paragraphs if p.text.strip()])
        
        # Regex or line-by-line parsing
        lines = text.split("\n")
        desc_lines = []
        parsing_desc = False
        
        for line in lines:
            line_lower = line.lower()
            if "item name" in line_lower:
                parts = re.split(r'[-–—]+', line, 1)
                if len(parts) > 1:
                    details["name"] = parts[1].strip()
                else:
                    details["name"] = line.replace("Item Name", "").strip()
            elif "load index" in line_lower:
                parts = re.split(r'[-–—]+', line, 1)
                if len(parts) > 1:
                    details["loadCapacity"] = parts[1].strip()
            elif "item diameter" in line_lower or "rim size" in line_lower:
                parts = re.split(r'[-–—]+', line, 1)
                if len(parts) > 1:
                    details["rimSize"] = parts[1].strip()
            
            # Simple description grabber
            desc_lines.append(line)
        
        if not details["name"]:
            # fallback to folder name if name not found in docx
            details["name"] = os.path.basename(os.path.dirname(filepath))
            
        details["description"] = " ".join(desc_lines[:3]) + ("..." if len(desc_lines) > 3 else "")
        
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        details["name"] = os.path.basename(os.path.dirname(filepath))
        
    return details

def main():
    products = []
    product_id = 1
    
    for root, dirs, files in os.walk(BASE_DIR):
        # find images
        images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if not images:
            continue
            
        # find docx
        docx_files = [f for f in files if f.lower().endswith('.docx')]
        
        product_details = {
            "name": os.path.basename(root),
            "description": "Premium SJR Tyre",
            "loadCapacity": "N/A",
            "rimSize": "N/A",
            "maxSpeed": "N/A",
            "pressure": "N/A"
        }
        
        if docx_files:
            docx_path = os.path.join(root, docx_files[0])
            parsed = parse_docx(docx_path)
            product_details.update(parsed)
            
        # build image paths
        # relative path from 'public' folder
        rel_root = os.path.relpath(root, r"d:\SRJtyres\frontend\public")
        # replace backslashes with forward slashes for web URLs
        rel_root = rel_root.replace("\\", "/")
        
        image_urls = [f"/{rel_root}/{img}" for img in images]
        
        # Build product object
        product = {
            "id": product_id,
            "name": product_details["name"],
            "category": "Two-Wheeler",  # Default category
            "fitment": "Universal",
            "brand": "SJR Tyres",
            "applications": ["General"],
            "image": image_urls[0] if image_urls else "",
            "description": product_details["description"],
            "specs": {
                "loadCapacity": product_details.get("loadCapacity", "N/A"),
                "maxSpeed": product_details.get("maxSpeed", "N/A"),
                "rimSize": product_details.get("rimSize", "N/A"),
                "pressure": product_details.get("pressure", "N/A")
            },
            "metrics": {
                "traction": 85,
                "durability": 90,
                "fuelEfficiency": 80,
                "comfort": 85
            },
            "images": image_urls
        }
        products.append(product)
        product_id += 1

    # write to productsData.js
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("export const products = ")
        f.write(json.dumps(products, indent=2))
        f.write(";\n")
        
    print(f"Successfully generated {len(products)} products.")

if __name__ == "__main__":
    main()
