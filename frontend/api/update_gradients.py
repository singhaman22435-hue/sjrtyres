import os
import re

target_dir = r"d:\SRJtyres\frontend\src"

replacements = {
    r'\bfrom-black\b': 'from-surface-dark',
    r'\bto-black\b': 'to-surface-dark',
    r'\bvia-black/': 'via-surface-dark/',
    r'\btext-black\b': 'text-surface-dark',
    r'#12100E': '#1A1C3D',  # Preloader tyre center
    r'bg-surface-dark/95': 'bg-surface-card/95', # Modal bg in Products
    r'bg-surface-dark/70': 'bg-surface-dark/80',
    r'bg-surface-card/30': 'bg-surface-card/40', 
    r'bg-white/10': 'bg-text-primary/10',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done updating gradients globally.")
