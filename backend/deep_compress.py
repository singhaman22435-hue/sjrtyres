import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from PIL import Image

public_dir = r"d:\SRJtyres\frontend\public"
src_dir = r"d:\SRJtyres\frontend\src"
db_url = "postgresql://neondb_owner:npg_IGCqpJEKh4d8@ep-bitter-firefly-ai18y2k1-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"

def convert_to_webp(filepath):
    """Convert an image to webp and delete the original."""
    try:
        base, ext = os.path.splitext(filepath)
        if ext.lower() in ['.webp', '.svg', '.gif', '.mp4']:
            return False
            
        webp_path = base + '.webp'
        with Image.open(filepath) as img:
            if img.mode in ("RGBA", "P"):
                # preserve transparency for PNGs
                img.save(webp_path, "WEBP", quality=85)
            else:
                img.save(webp_path, "WEBP", quality=80)
        
        # Remove original
        os.remove(filepath)
        return True
    except Exception as e:
        print(f"Error converting {filepath}: {e}")
        return False

# 1. Convert all images in public directory
print("Converting images to WebP...")
converted_count = 0
for root, _, files in os.walk(public_dir):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(root, file)
            if convert_to_webp(filepath):
                converted_count += 1
print(f"Converted {converted_count} images to WebP.")

# 2. Update React Codebase
print("Updating codebase references...")
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for ext in ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG']:
                new_content = new_content.replace(ext, '.webp')
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

# 3. Update Database
print("Updating Neon Database...")
try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT id, image, images FROM products")
    rows = cursor.fetchall()
    
    def replace_ext(path):
        if not path: return path
        for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']:
            if path.endswith(ext):
                return path[:-len(ext)] + '.webp'
        return path
        
    for row in rows:
        new_image = replace_ext(row['image'])
        new_images = [replace_ext(img) for img in row['images']] if row['images'] else []
        
        cursor.execute("UPDATE products SET image = %s, images = %s WHERE id = %s",
                      (new_image, json.dumps(new_images), row['id']))
                      
    conn.commit()
    cursor.close()
    conn.close()
    print("Database updated successfully.")
except Exception as e:
    print(f"Database update failed: {e}")

print("✅ Deep Compression Complete!")
