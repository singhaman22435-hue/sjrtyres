import os
from PIL import Image

folder_path = r"d:\SRJtyres\frontend\public\tyre images"
MAX_SIZE = (1200, 1200)

def compress_images():
    total_original = 0
    total_new = 0
    count = 0

    for dirpath, dirnames, filenames in os.walk(folder_path):
        for f in filenames:
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                filepath = os.path.join(dirpath, f)
                try:
                    # Get original size
                    original_size = os.path.getsize(filepath)
                    total_original += original_size
                    
                    # Open and compress
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB for JPEG compatibility if saving as JPEG
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                            
                        # Resize if too large
                        img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
                        
                        # Save in place with optimization
                        img.save(filepath, format="JPEG", quality=75, optimize=True)
                    
                    new_size = os.path.getsize(filepath)
                    total_new += new_size
                    count += 1
                    
                except Exception as e:
                    print(f"Failed to process {f}: {e}")

    print(f"Compressed {count} images.")
    print(f"Original Size: {total_original / (1024*1024):.2f} MB")
    print(f"New Size: {total_new / (1024*1024):.2f} MB")
    print(f"Saved: {(total_original - total_new) / (1024*1024):.2f} MB!")

if __name__ == "__main__":
    compress_images()
