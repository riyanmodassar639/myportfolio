<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$result = mysqli_query(
    $conn,
    "SELECT is_active, updated_at FROM maintenance_mode WHERE id = 1 LIMIT 1"
);

$row = $result ? mysqli_fetch_assoc($result) : null;

echo json_encode([
    "success" => true,
    "is_maintenance" => $row ? (int)$row["is_active"] : 0,
    "updated_at" => $row ? $row["updated_at"] : null
]);
?>