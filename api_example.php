<?php
// TENTO SOUBOR NAHRAJTE NA SERVER jako "api.php"
// Povolení CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === KONFIGURACE DATABÁZE ===
$host = "localhost"; 
$db_name = "celkove_zdravi";
$username = "vase_uzivatelske_jmeno"; // DOPLŇTE
$password = "vase_heslo";             // DOPLŇTE

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit;
}

// Zpracování vstupu
$method = $_SERVER['REQUEST_METHOD'];
$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);

// --- GET REQUESTS ---
if ($method === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    if ($action == 'get_services') {
        $stmt = $conn->prepare("SELECT * FROM services");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    elseif ($action == 'get_reservations') {
        // Admin: Načíst všechny rezervace (seřazené od nejnovějších)
        $query = "SELECT r.*, s.title as service_title FROM reservations r 
                  LEFT JOIN services s ON r.service_id = s.id 
                  ORDER BY r.reservation_date DESC, r.reservation_time ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    else {
        echo json_encode(["message" => "API Ready"]);
    }
}

// --- POST REQUESTS ---
if ($method === 'POST') {
    $action = isset($input['action']) ? $input['action'] : '';

    // 1. Vytvoření rezervace (Klient)
    if ($action == 'create_reservation') {
        try {
            $query = "INSERT INTO reservations (client_name, client_email, client_phone, reservation_date, reservation_time, service_id, note, status) 
                      VALUES (:name, :email, :phone, :date, :time, :serviceId, :note, 'pending')";
            $stmt = $conn->prepare($query);
            
            $stmt->bindParam(":name", $input['name']);
            $stmt->bindParam(":email", $input['email']);
            $stmt->bindParam(":phone", $input['phone']);
            $stmt->bindParam(":date", $input['date']);
            $stmt->bindParam(":time", $input['time']);
            $stmt->bindParam(":serviceId", $input['serviceId']);
            $stmt->bindParam(":note", $input['note']);
            
            if($stmt->execute()) {
                echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
            } else {
                echo json_encode(["success" => false, "message" => "DB Error"]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    // 2. Aktualizace stavu rezervace (Admin)
    elseif ($action == 'update_reservation_status') {
        try {
            $query = "UPDATE reservations SET status = :status WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":status", $input['status']);
            $stmt->bindParam(":id", $input['id']);
            
            if($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    // 3. Aktualizace ceny služby (Admin)
    elseif ($action == 'update_service_price') {
        try {
            $query = "UPDATE services SET price = :price WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":price", $input['price']);
            $stmt->bindParam(":id", $input['id']);
            
            if($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }
}
?>