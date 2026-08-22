<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'jwt.php';

// Route parsing
$route = isset($_GET['route']) ? $_GET['route'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Helper for JSON response
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Helper to get input JSON
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

// Helper for admin logging
function logAction($pdo, $userId, $action, $details) {
    $stmt = $pdo->prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $action, json_encode($details)]);
}

$UPLOAD_DIR = __DIR__ . '/../frontend/public/tyre images/';
if (!file_exists($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0777, true);
}

// --- Router ---
// Parse route segments
$segments = explode('/', trim($route, '/'));

// Check for products endpoint
if ($segments[0] == 'products') {
    if ($method == 'GET') {
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $size = isset($_GET['size']) ? $_GET['size'] : null;
        
        $sql = "SELECT * FROM products";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $products = $stmt->fetchAll();
        
        $formatted = [];
        foreach ($products as $p) {
            // Apply simple filter
            if ($category && $p['category'] !== $category) continue;
            // Since size isn't explicitly in the schema, we skip strict size filtering or assume it's in specs
            
            $formatted[] = [
                "id" => $p['id'],
                "name" => $p['name'],
                "category" => $p['category'],
                "fitment" => $p['fitment'],
                "brand" => $p['brand'],
                "applications" => json_decode($p['applications']),
                "image" => $p['image'],
                "images" => json_decode($p['images']),
                "description" => $p['description'],
                "specs" => json_decode($p['specs']),
                "metrics" => json_decode($p['metrics']),
                "isFeatured" => (bool)$p['is_featured']
            ];
        }
        jsonResponse($formatted);
    }
    
    // Check if it's bulk-upload
    if (isset($segments[1]) && $segments[1] == 'bulk-upload' && $method == 'POST') {
        verify_token();
        $folderName = isset($_POST['folder_name']) ? $_POST['folder_name'] : 'Unknown Product';
        $category = isset($_POST['category']) ? $_POST['category'] : 'Two-Wheeler';
        $fitment = isset($_POST['fitment']) ? $_POST['fitment'] : 'Universal';
        $brand = isset($_POST['brand']) ? $_POST['brand'] : 'SJR Tyres';
        
        // Simplified text description instead of docx
        $description = isset($_POST['description']) ? $_POST['description'] : '';
        
        $imageUrls = [];
        $mainImage = '';
        
        if (isset($_FILES['images'])) {
            $total = count($_FILES['images']['name']);
            for ($i = 0; $i < $total; $i++) {
                if ($_FILES['images']['error'][$i] == 0) {
                    $tmpName = $_FILES['images']['tmp_name'][$i];
                    $name = time() . '_' . basename($_FILES['images']['name'][$i]);
                    $dest = $UPLOAD_DIR . $name;
                    move_uploaded_file($tmpName, $dest);
                    $url = "/tyre images/" . $name;
                    $imageUrls[] = $url;
                    if (!$mainImage) $mainImage = $url;
                }
            }
        }
        
        $sql = "INSERT INTO products (name, category, fitment, brand, image, images, description, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$folderName, $category, $fitment, $brand, $mainImage, json_encode($imageUrls), $description, 0]);
        jsonResponse(["message" => "Imported successfully", "id" => $pdo->lastInsertId()], 201);
    }

    if ($method == 'POST') {
        verify_token();
        $data = getJsonInput();
        $sql = "INSERT INTO products (name, category, fitment, brand, image, images, description, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['name'], $data['category'], $data['fitment'], $data['brand'],
            isset($data['image']) ? $data['image'] : '/tyre images/default.webp',
            json_encode(isset($data['images']) ? $data['images'] : []),
            isset($data['description']) ? $data['description'] : '',
            isset($data['isFeatured']) ? $data['isFeatured'] : 0
        ]);
        jsonResponse(["message" => "Product added", "id" => $pdo->lastInsertId()], 201);
    }
    
    if (isset($segments[1]) && is_numeric($segments[1])) {
        $id = $segments[1];
        if ($method == 'PUT') {
            verify_token();
            $data = getJsonInput();
            $sql = "UPDATE products SET name=?, category=?, fitment=?, brand=?, image=?, images=?, description=?, is_featured=? WHERE id=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['name'], $data['category'], $data['fitment'], $data['brand'],
                $data['image'], json_encode($data['images']), $data['description'], $data['isFeatured'], $id
            ]);
            jsonResponse(["message" => "Product updated"]);
        }
        if ($method == 'DELETE') {
            verify_token();
            $stmt = $pdo->prepare("DELETE FROM products WHERE id=?");
            $stmt->execute([$id]);
            jsonResponse(["message" => "Product deleted"]);
        }
    }
}

elseif ($segments[0] == 'upload' && $method == 'POST') {
    verify_token();
    $imageUrls = [];
    if (isset($_FILES['images'])) {
        $total = count($_FILES['images']['name']);
        for ($i = 0; $i < $total; $i++) {
            if ($_FILES['images']['error'][$i] == 0) {
                $tmpName = $_FILES['images']['tmp_name'][$i];
                $name = time() . '_' . basename($_FILES['images']['name'][$i]);
                $dest = $UPLOAD_DIR . $name;
                move_uploaded_file($tmpName, $dest);
                $imageUrls[] = "/tyre images/" . $name;
            }
        }
    }
    jsonResponse(["urls" => $imageUrls]);
}

elseif ($segments[0] == 'contact' && $method == 'POST') {
    $data = getJsonInput();
    if (!isset($data['email'])) {
        jsonResponse(["error" => "Missing fields"], 400);
    }
    $sql = "INSERT INTO leads (name, email, phone, inquiry_type, message, status) VALUES (?, ?, ?, ?, ?, 'Pending')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        isset($data['name']) ? $data['name'] : '',
        $data['email'],
        isset($data['phone']) ? $data['phone'] : '',
        isset($data['vehicleType']) ? $data['vehicleType'] : 'General',
        isset($data['message']) ? $data['message'] : ''
    ]);
    jsonResponse(["message" => "Lead saved", "id" => $pdo->lastInsertId()], 201);
}

elseif ($segments[0] == 'leads') {
    verify_token();
    if ($method == 'GET') {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
        $leads = $stmt->fetchAll();
        $formatted = [];
        foreach ($leads as $lead) {
            $formatted[] = [
                "_id" => (string)$lead['id'],
                "name" => $lead['name'],
                "email" => $lead['email'],
                "phone" => $lead['phone'],
                "inquiryType" => $lead['inquiry_type'],
                "message" => $lead['message'],
                "status" => $lead['status'],
                "createdAt" => $lead['created_at']
            ];
        }
        jsonResponse($formatted);
    }
    
    if (isset($segments[1])) {
        $id = $segments[1];
        if ($method == 'PUT') {
            $data = getJsonInput();
            $stmt = $pdo->prepare("UPDATE leads SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $id]);
            jsonResponse(["message" => "Lead updated"]);
        }
        if ($method == 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
            $stmt->execute([$id]);
            jsonResponse(["message" => "Lead deleted"]);
        }
    }
}

elseif ($segments[0] == 'admin') {
    if (isset($segments[1]) && $segments[1] == 'login' && $method == 'POST') {
        $data = getJsonInput();
        // Default admin password logic. Change hash or use DB later.
        if ($data['username'] == 'admin' && $data['password'] == 'admin') {
            $token = JWT::encode([
                "user" => "admin",
                "exp" => time() + (24 * 3600)
            ]);
            logAction($pdo, "admin", "Admin Login", ["ip" => $_SERVER['REMOTE_ADDR']]);
            jsonResponse([
                "token" => $token,
                "user" => ["username" => "admin", "role" => "admin"]
            ]);
        }
        jsonResponse(["error" => "Invalid credentials"], 401);
    }
    
    // Secured admin routes below
    verify_token();
    
    if (isset($segments[1]) && $segments[1] == 'analytics' && $method == 'GET') {
        $total_leads = $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
        $active_products = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        $closed_leads = $pdo->query("SELECT COUNT(*) FROM leads WHERE status IN ('Closed', 'Shipped')")->fetchColumn();
        
        $conv = $total_leads > 0 ? round(($closed_leads / $total_leads) * 100, 1) : 0;
        
        $pop = $pdo->query("SELECT category as name, COUNT(*) as value FROM products GROUP BY category")->fetchAll();
        $status_leads = $pdo->query("SELECT status as name, COUNT(*) as value FROM leads GROUP BY status")->fetchAll();
        
        jsonResponse([
            "total_leads" => $total_leads,
            "active_products" => $active_products,
            "conversion_rate" => $conv . "%",
            "product_popularity" => $pop,
            "leads_by_status" => $status_leads
        ]);
    }
    
    if (isset($segments[1]) && $segments[1] == 'inventory' && isset($segments[2]) && $method == 'PUT') {
        $id = $segments[2];
        $data = getJsonInput();
        $stmt = $pdo->prepare("UPDATE products SET stock_count = ?, low_stock_threshold = ? WHERE id = ?");
        $stmt->execute([$data['stockCount'] ?? 0, $data['lowStockThreshold'] ?? 10, $id]);
        jsonResponse(["message" => "Inventory updated"]);
    }
    
    if (isset($segments[1]) && $segments[1] == 'seo' && isset($segments[2]) && $method == 'PUT') {
        $id = $segments[2];
        $data = getJsonInput();
        $stmt = $pdo->prepare("UPDATE products SET meta_title = ?, meta_description = ?, meta_keywords = ? WHERE id = ?");
        $stmt->execute([$data['metaTitle'] ?? '', $data['metaDescription'] ?? '', $data['metaKeywords'] ?? '', $id]);
        jsonResponse(["message" => "SEO updated"]);
    }
    
    if (isset($segments[1]) && $segments[1] == 'cms') {
        if ($method == 'GET') {
            $content = $pdo->query("SELECT `key`, value FROM content")->fetchAll();
            $res = [];
            foreach ($content as $c) {
                $res[$c['key']] = json_decode($c['value'], true);
            }
            jsonResponse($res);
        }
        if ($method == 'POST') {
            $data = getJsonInput();
            foreach ($data as $key => $val) {
                $stmt = $pdo->prepare("INSERT INTO content (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?");
                $v = json_encode($val);
                $stmt->execute([$key, $v, $v]);
            }
            jsonResponse(["message" => "Content saved"]);
        }
    }
    
    if (isset($segments[1]) && $segments[1] == 'logs' && $method == 'GET') {
        $logs = $pdo->query("SELECT * FROM logs ORDER BY created_at DESC LIMIT 100")->fetchAll();
        jsonResponse($logs);
    }
}

// 404 Fallback
jsonResponse(["error" => "Endpoint not found"], 404);
?>
