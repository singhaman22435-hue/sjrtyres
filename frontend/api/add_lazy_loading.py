import os
import re

src_dir = r"d:\SRJtyres\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find <img tags that don't have loading=
    # Replace <img with <img loading="lazy" if loading="lazy" is not there
    # It's safer to use regex
    
    # We want to match `<img ` and check if it already has `loading=`
    # A simple approach is just replace all `<img ` with `<img loading="lazy" `
    # and then replace `<img loading="lazy" loading="lazy"` back to `<img loading="lazy"`
    
    new_content = content.replace("<img ", "<img loading=\"lazy\" ")
    new_content = new_content.replace("loading=\"lazy\" loading=\"lazy\"", "loading=\"lazy\"")
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))

print("Lazy loading added.")
