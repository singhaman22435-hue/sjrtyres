import fitz

PDF_PATH = r"d:\SRJtyres\frontend\src\sjr catlog.pdf"
doc = fitz.open(PDF_PATH)
print(f"Total pages: {len(doc)}")

if len(doc) > 0:
    page = doc.load_page(0)
    text = page.get_text("text")
    print(f"Text length on page 0: {len(text)}")
    if len(text) == 0:
        print("Page seems to be an image. Let's check images.")
        images = page.get_images(full=True)
        print(f"Found {len(images)} images on page 0.")
