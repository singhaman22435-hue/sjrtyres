import fitz  # PyMuPDF
import os
from PIL import Image

PDF_PATH = r"d:\SRJtyres\frontend\src\sjr catlog.pdf"
OUT_IMG_DIR = r"d:\SRJtyres\frontend\public\catalog"

os.makedirs(OUT_IMG_DIR, exist_ok=True)

print(f"Loading PDF from: {PDF_PATH}")
doc = fitz.open(PDF_PATH)
total_pages = len(doc)
print(f"Total Pages to Process: {total_pages}")

# Use a scale to get high resolution (e.g., 2.0 = 144 DPI)
zoom = 2.0 
mat = fitz.Matrix(zoom, zoom)

for page_num in range(total_pages):
    page = doc.load_page(page_num)
    
    # Render page to an image (pixmap)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    img_filename = f"page_{page_num + 1}.webp"
    img_path = os.path.join(OUT_IMG_DIR, img_filename)
    
    # Save as webp for maximum performance using Pillow
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img.save(img_path, "webp", quality=85)
    print(f"[{page_num + 1}/{total_pages}] Saved: {img_filename}")

print(f"\n✅ All {total_pages} pages successfully rendered to: {OUT_IMG_DIR}")
