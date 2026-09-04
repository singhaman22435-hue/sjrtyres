import os
import re

target_dir = r"d:\SRJtyres\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Reduce heavy backdrop blurs which kill GPU performance
    content = re.sub(r'backdrop-blur-3xl', 'backdrop-blur-sm', content)
    content = re.sub(r'backdrop-blur-2xl', 'backdrop-blur-sm', content)
    content = re.sub(r'backdrop-blur-xl', 'backdrop-blur-md', content)
    
    # Add loading="lazy" to all img tags that don't have it
    # Find all <img ...> tags
    img_pattern = re.compile(r'<img\s+([^>]+)>')
    
    def add_lazy(match):
        attrs = match.group(1)
        if 'loading=' not in attrs:
            return f'<img loading="lazy" {attrs}>'
        return match.group(0)
        
    content = img_pattern.sub(add_lazy, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Optimized: {filepath}")

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done optimizing performance globally.")
