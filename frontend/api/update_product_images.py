import os
import json
import re

public_dir = r"d:\SRJtyres\frontend\public"
products_file = r"d:\SRJtyres\frontend\src\productsData.js"

# Read existing productsData.js
with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the dummyProducts array from the JS file
match = re.search(r'export const dummyProducts = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Could not parse dummyProducts array")
    exit(1)

products = json.loads(match.group(1))

# For each product, extract the folder name from its current 'image' path
# and find all JPGs in that folder
for product in products:
    current_image = product.get('image', '')
    if current_image:
        # e.g. "/tyre images/New folder (2)/1009017 Speed X10 TL/4K0A4173.JPG"
        folder_path = os.path.dirname(current_image)
        # Convert to absolute path on disk
        abs_folder_path = os.path.join(public_dir, folder_path.lstrip('/'))
        
        # List all images in this folder
        if os.path.exists(abs_folder_path):
            all_images = [f for f in os.listdir(abs_folder_path) if f.lower().endswith('.jpg') or f.lower().endswith('.png')]
            all_images.sort()
            
            # Create array of paths
            image_paths = [folder_path + '/' + img for img in all_images]
            product['images'] = image_paths
            # Keep the first image as 'image' for backwards compatibility
            if image_paths:
                product['image'] = image_paths[0]
        else:
            product['images'] = [current_image]

# Write back to productsData.js
new_content = "export const dummyProducts = " + json.dumps(products, indent=2) + ";\n"
with open(products_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated productsData.js with multiple images.")
