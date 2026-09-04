import os
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

# Neon.tech or Local Postgres URI
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/sjr_tyres")

# Global Connection Pool
try:
    db_pool = ThreadedConnectionPool(1, 20, DATABASE_URL, cursor_factory=RealDictCursor)
except Exception as e:
    print(f"Failed to initialize database pool: {e}")
    db_pool = None

class PooledConnection:
    def __init__(self, conn, pool):
        self.conn = conn
        self.pool = pool
    
    def cursor(self, *args, **kwargs):
        return self.conn.cursor(*args, **kwargs)
        
    def commit(self):
        self.conn.commit()
        
    def rollback(self):
        self.conn.rollback()

    def close(self):
        # Return connection to the pool instead of closing it
        if self.pool and self.conn:
            self.pool.putconn(self.conn)
            self.conn = None

def get_db_connection():
    if not db_pool:
        return None
    try:
        conn = db_pool.getconn()
        return PooledConnection(conn, db_pool)
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        return
        
    try:
        cursor = conn.cursor()
        
        # Create Leads Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                inquiry_type VARCHAR(100),
                message TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create Products Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
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
        
        # Safe alter table for products to add new inventory/seo columns
        cursor.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 0")
        cursor.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10")
        cursor.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255)")
        cursor.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT")
        cursor.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords TEXT")

        # Create Content Table (CMS)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS content (
                id SERIAL PRIMARY KEY,
                key VARCHAR(100) UNIQUE NOT NULL,
                value JSONB,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create Logs Table (Audit Trail)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100),
                action VARCHAR(255),
                details JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        cursor.close()
        print("✅ PostgreSQL Database Initialized (Neon Tech Ready)")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()
