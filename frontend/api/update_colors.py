import os
import re

target_dir = r"d:\SRJtyres\frontend\src"

replacements = {
    r'\bbg-black\b': 'bg-surface-dark',
    r'\btext-white\b': 'text-text-primary',
    r'\btext-gray-300\b': 'text-text-secondary',
    r'\btext-gray-400\b': 'text-text-secondary',
    r'\bfrom-red-600\b': 'from-brand-dark',
    r'\bto-red-600\b': 'to-brand',
    r'\bhover:bg-red-500\b': 'hover:bg-brand-dark',
    r'\btext-red-500\b': 'text-brand',
    r'\bborder-white/': 'border-text-primary/',
    r'rgba\(227,\s*0,\s*15': 'rgba(112,214,197',  # Mint Green RGB
    r'\bbg-black/': 'bg-surface-dark/',
    r'\btext-white/': 'text-text-primary/',
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

print("Done updating colors globally.")
