import os
import re
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Provide URL directly for the script
DATABASE_URL = "postgresql://neondb_owner:npg_IGCqpJEKh4d8@ep-bitter-firefly-ai18y2k1-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"

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

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

print("Dropping existing products table if exists...")
cursor.execute("DROP TABLE IF EXISTS products;")

print("Creating new products table with JSONB support...")
cursor.execute('''
    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        fitment VARCHAR(100),
        brand VARCHAR(100),
        applications JSONB,
        image TEXT,
        images JSONB,
        description TEXT,
        specs JSONB,
        metrics JSONB,
        is_featured BOOLEAN DEFAULT FALSE
    )
''')

print(f"Inserting {len(products)} products into Neon DB...")
for p in products:
    cursor.execute('''
        INSERT INTO products (name, category, fitment, brand, applications, image, images, description, specs, metrics)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
        p.get('name'),
        p.get('category'),
        p.get('fitment'),
        p.get('brand'),
        json.dumps(p.get('applications', [])),
        p.get('image'),
        json.dumps(p.get('images', [])),
        p.get('description'),
        json.dumps(p.get('specs', {})),
        json.dumps(p.get('metrics', {}))
    ))

conn.commit()
cursor.close()
conn.close()

print("✅ Data successfully migrated to Neon PostgreSQL!")
