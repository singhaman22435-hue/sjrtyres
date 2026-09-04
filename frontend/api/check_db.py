import psycopg2
from psycopg2.extras import RealDictCursor

db_url = 'postgresql://neondb_owner:npg_IGCqpJEKh4d8@ep-bitter-firefly-ai18y2k1-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
conn = psycopg2.connect(db_url)
cursor = conn.cursor(cursor_factory=RealDictCursor)
cursor.execute("SELECT name, image FROM products LIMIT 5;")
print(cursor.fetchall())
