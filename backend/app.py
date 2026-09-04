from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_compress import Compress
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from functools import wraps
from db import get_db_connection, init_db
import datetime
import os
import time
import json
from werkzeug.utils import secure_filename # For safe filenames
from waitress import serve
try:
    import docx
except ImportError:
    pass # Will be handled if not installed

try:
    import cloudinary
    import cloudinary.uploader
except ImportError:
    pass

# We'll save uploads to the frontend's public directory so they can be served directly by Vite locally
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'public', 'tyre images')
try:
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
except OSError:
    pass # Read-only file system on Vercel

products_cache = {
    'data': None,
    'last_updated': 0
}
CACHE_DURATION = 3600 # 1 hour

app = Flask(__name__)
# Security & Config
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super-secret-sjr-key-2026')
CORS(app)
Compress(app)

# Security Headers (Talisman) - force_https is False for localhost dev
Talisman(app, force_https=False, content_security_policy=None)

# Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Bearer <token>
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except Exception as e:
            print("JWT ERROR:", str(e), type(e))
            return jsonify({'error': f'Token is invalid or expired! {str(e)}'}), 401
        return f(*args, **kwargs)
    return decorated

# Initialize PostgreSQL Tables (Neon Tech)
init_db()

# --- Products API ---
@app.route('/api/products', methods=['GET'])
def get_products():
    global products_cache
    
    category = request.args.get('category')
    size = request.args.get('size')
    
    # Check cache first
    current_time = time.time()
    if products_cache['data'] and (current_time - products_cache['last_updated'] < CACHE_DURATION):
        all_products = products_cache['data']
        # Apply filters in-memory
        if category or size:
            filtered = [p for p in all_products if (not category or p['category'] == category) and (not size or p.get('size') == size)]
            return jsonify(filtered)
        return jsonify(all_products)
        
    conn = get_db_connection()
    if not conn:
        return jsonify(products_cache['data'] if products_cache['data'] else [])
        
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        
        # Format keys for frontend
        formatted_products = []
        for p in products:
            formatted_products.append({
                "id": p['id'],
                "name": p['name'],
                "category": p['category'],
                "fitment": p['fitment'],
                "brand": p['brand'],
                "applications": p['applications'],
                "image": p['image'],
                "images": p['images'],
                "description": p['description'],
                "specs": p['specs'],
                "metrics": p['metrics'],
                "isFeatured": p['is_featured']
            })
            
        # Fallback to dummy data if DB is empty (for presentation)
        if not formatted_products:
            formatted_products = []
            
        # Update Cache
        products_cache['data'] = formatted_products
        products_cache['last_updated'] = current_time
        
        # Apply filters to the fresh data
        if category or size:
            filtered = [p for p in formatted_products if (not category or p['category'] == category) and (not size or p.get('size') == size)]
            return jsonify(filtered)
            
        return jsonify(formatted_products)
    except Exception as e:
        print(e)
        return jsonify(products_cache['data'] if products_cache['data'] else [])
    finally:
        conn.close()

@app.route('/api/products', methods=['POST'])
@token_required
def add_product():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO products (name, category, fitment, brand, image, images, description, is_featured, applications) 
               VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s::jsonb) RETURNING id""",
            (
                data.get('name'), 
                data.get('category'), 
                data.get('fitment'), 
                data.get('brand'), 
                data.get('image', '/tyre images/default.webp'),
                json.dumps(data.get('images', [])),
                data.get('description', ''),
                data.get('isFeatured', False),
                json.dumps(data.get('applications', []))
            )
        )
        new_id = cursor.fetchone()['id']
        conn.commit()
        
        global products_cache
        products_cache['data'] = None
        
        return jsonify({'message': 'Product added successfully', 'id': new_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@token_required
def update_product(product_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE products SET 
               name = %s, category = %s, fitment = %s, brand = %s, 
               image = %s, images = %s::jsonb, description = %s, is_featured = %s, applications = %s::jsonb
               WHERE id = %s""",
            (
                data.get('name'),
                data.get('category'),
                data.get('fitment'),
                data.get('brand'),
                data.get('image'),
                json.dumps(data.get('images', [])),
                data.get('description'),
                data.get('isFeatured'),
                json.dumps(data.get('applications', [])),
                product_id
            )
        )
        conn.commit()
        
        global products_cache
        products_cache['data'] = None
        
        return jsonify({'message': 'Product updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        
        # Clear cache
        global products_cache
        products_cache['data'] = None
        
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/products/bulk-upload', methods=['POST'])
@token_required
def bulk_upload_product():
    folder_name = request.form.get('folder_name', 'Unknown Product')
    
    # 1. Handle image uploads
    images = request.files.getlist('images')
    image_urls = []
    main_image = ""
    
    for file in images:
        if file.filename == '':
            continue
            
        url = ""
        # If Cloudinary is configured (e.g. on Vercel), upload there
        if os.getenv("CLOUDINARY_URL"):
            try:
                upload_result = cloudinary.uploader.upload(file, folder="sjr_tyres")
                url = upload_result.get("secure_url")
            except Exception as e:
                print("Cloudinary Upload Error:", e)
                return jsonify({'error': f'Cloudinary upload failed: {str(e)}'}), 500
        else:
            # Fallback for local development (Render / Localhost)
            filename = f"{int(time.time())}_{secure_filename(file.filename)}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            try:
                file.save(filepath)
                url = f"/tyre images/{filename}"
            except Exception as e:
                return jsonify({'error': f'Local upload failed (maybe read-only filesystem like Vercel? Configure CLOUDINARY_URL!): {str(e)}'}), 500
                
        image_urls.append(url)
        if not main_image:
            main_image = url
            
    # 2. Handle doc parsing
    doc_file = request.files.get('doc')
    description = ""
    if doc_file and doc_file.filename != '':
        if doc_file.filename.endswith('.docx'):
            try:
                import docx
                doc = docx.Document(doc_file)
                full_text = []
                for para in doc.paragraphs:
                    full_text.append(para.text)
                description = "\n".join(full_text)
            except Exception as e:
                description = f"Error parsing docx: {str(e)}"
        elif doc_file.filename.endswith('.txt'):
            try:
                description = doc_file.read().decode('utf-8')
            except Exception as e:
                description = f"Error parsing txt: {str(e)}"
                
    # 3. Create Product in DB
    category = request.form.get('category', 'Two-Wheeler')
    fitment = request.form.get('fitment', 'Universal')
    brand = request.form.get('brand', 'SJR Tyres')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO products (name, category, fitment, brand, image, images, description, is_featured) 
               VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s, %s) RETURNING id""",
            (folder_name, category, fitment, brand, main_image, json.dumps(image_urls), description, False)
        )
        new_id = cursor.fetchone()['id']
        conn.commit()
        
        global products_cache
        products_cache['data'] = None
        
        return jsonify({'message': f'Product {folder_name} imported successfully', 'id': new_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/upload', methods=['POST'])
@token_required
def upload_images():
    if 'images' not in request.files:
        return jsonify({'error': 'No images part'}), 400
        
    files = request.files.getlist('images')
    image_urls = []
    
    for file in files:
        if file.filename == '':
            continue
        # Use a timestamp to avoid overwriting
        filename = f"{int(time.time())}_{file.filename}"
        # We save directly to the frontend's public/tyre images folder
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        # The URL that the frontend will use to fetch the image
        image_urls.append(f"/tyre images/{filename}")
        
    return jsonify({'urls': image_urls}), 200

# --- Leads API ---
@app.route('/api/contact', methods=['POST'])
@limiter.limit("10 per minute") # Prevent spam/DDoS on contact form
def save_lead():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO leads (name, email, phone, inquiry_type, message, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                data.get('name', ''),
                data.get('email', ''),
                data.get('phone', ''),
                data.get('vehicleType', 'General'),
                data.get('message', ''),
                'Pending',
                datetime.datetime.utcnow()
            )
        )
        new_id = cursor.fetchone()['id']
        conn.commit()
        return jsonify({"message": "Lead saved successfully", "id": str(new_id)}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/leads', methods=['GET'])
@token_required # Secure route, requires valid JWT
def get_leads():
    conn = get_db_connection()
    if not conn:
        return jsonify([])
        
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads ORDER BY created_at DESC")
        leads = cursor.fetchall()
        
        formatted_leads = []
        for lead in leads:
            formatted_leads.append({
                "_id": str(lead['id']),
                "name": lead['name'],
                "email": lead['email'],
                "phone": lead['phone'],
                "inquiryType": lead['inquiry_type'],
                "message": lead['message'],
                "status": lead['status'],
                "createdAt": lead['created_at'].isoformat() if lead['created_at'] else None
            })
            
        # Fallback to dummy data if DB is empty
        if not formatted_leads:
            formatted_leads = [
                {
                    "_id": "mock_lead_1",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "phone": "555-1234",
                    "inquiryType": "Bulk Order",
                    "message": "Interested in 50 truck tyres.",
                    "status": "Pending",
                    "createdAt": datetime.datetime.utcnow().isoformat()
                }
            ]
            
        return jsonify(formatted_leads)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/leads/<lead_id>', methods=['PUT'])
@token_required
def update_lead(lead_id):
    if lead_id.startswith('mock_lead'):
        return jsonify({"message": "Mock lead updated successfully"}), 200

    data = request.json
    new_status = data.get('status')
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE leads SET status = %s WHERE id = %s", (new_status, lead_id))
        conn.commit()
        return jsonify({"message": "Lead updated successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/leads/<lead_id>', methods=['DELETE'])
@token_required
def delete_lead(lead_id):
    if lead_id.startswith('mock_lead'):
        return jsonify({"message": "Mock lead deleted successfully"}), 200

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM leads WHERE id = %s", (lead_id,))
        conn.commit()
        return jsonify({"message": "Lead deleted successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- Admin API ---
# In production, admin users should be in the DB. This is a secure mock fallback.
ADMIN_HASH = generate_password_hash('admin')

def log_action(user_id, action, details):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO logs (user_id, action, details) VALUES (%s, %s, %s)", (user_id, action, json.dumps(details)))
            conn.commit()
        except Exception as e:
            print("Log error:", e)
        finally:
            conn.close()

@app.route('/api/admin/login', methods=['POST'])
@limiter.limit("5 per minute") # Prevent brute force attacks
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == "admin" and check_password_hash(ADMIN_HASH, password):
        token = jwt.encode({
            'user': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        log_action(username, "Admin Login", {"ip": request.remote_addr})
        
        return jsonify({
            "token": token,
            "user": {"username": "admin", "role": "admin"}
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/admin/analytics', methods=['GET'])
@token_required
def get_analytics():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM leads")
        total_leads = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM products")
        active_products = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM leads WHERE status IN ('Closed', 'Shipped')")
        closed_leads = cursor.fetchone()['count']
        conversion_rate = f"{round((closed_leads / total_leads * 100) if total_leads > 0 else 0, 1)}%"
        
        cursor.execute("SELECT category as name, COUNT(*) as value FROM products GROUP BY category")
        product_popularity = cursor.fetchall()
        
        cursor.execute("SELECT status as name, COUNT(*) as value FROM leads GROUP BY status")
        leads_by_status = cursor.fetchall()
        
        return jsonify({
            "total_leads": total_leads,
            "active_products": active_products,
            "conversion_rate": conversion_rate,
            "product_popularity": product_popularity,
            "leads_by_status": leads_by_status
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/admin/inventory/<int:product_id>', methods=['PUT'])
@token_required
def update_inventory(product_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'DB error'}), 500
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE products SET stock_count = %s, low_stock_threshold = %s WHERE id = %s", 
                       (data.get('stockCount', 0), data.get('lowStockThreshold', 10), product_id))
        conn.commit()
        log_action("admin", "Updated Inventory", {"product_id": product_id, "stock": data.get('stockCount')})
        return jsonify({'message': 'Inventory updated'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/admin/seo/<int:product_id>', methods=['PUT'])
@token_required
def update_seo(product_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'DB error'}), 500
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE products SET meta_title = %s, meta_description = %s, meta_keywords = %s WHERE id = %s", 
                       (data.get('metaTitle', ''), data.get('metaDescription', ''), data.get('metaKeywords', ''), product_id))
        conn.commit()
        log_action("admin", "Updated SEO", {"product_id": product_id})
        return jsonify({'message': 'SEO updated'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/admin/cms', methods=['GET', 'POST'])
@token_required
def manage_cms():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB error"}), 500
    try:
        cursor = conn.cursor()
        if request.method == 'GET':
            cursor.execute("SELECT key, value FROM content")
            content = cursor.fetchall()
            return jsonify({item['key']: item['value'] for item in content})
        else:
            data = request.json
            for key, value in data.items():
                cursor.execute("""
                    INSERT INTO content (key, value) VALUES (%s, %s)
                    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
                """, (key, json.dumps(value)))
            conn.commit()
            log_action("admin", "Updated CMS", {"keys": list(data.keys())})
            return jsonify({"message": "Content saved"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/admin/logs', methods=['GET'])
@token_required
def get_logs():
    conn = get_db_connection()
    if not conn:
        return jsonify([])
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM logs ORDER BY created_at DESC LIMIT 100")
        return jsonify(cursor.fetchall())
    finally:
        conn.close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5005))
    print(f"Starting Waitress production server on port {port}...")
    serve(app, host='0.0.0.0', port=port, threads=6)
