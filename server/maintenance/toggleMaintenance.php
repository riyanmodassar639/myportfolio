<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$result = mysqli_query(
    $conn,
    "SELECT is_active FROM maintenance_mode WHERE id = 1 LIMIT 1"
);

$row = $result ? mysqli_fetch_assoc($result) : null;

$newStatus = ($row && (int)$row["is_active"] === 1) ? 0 : 1;

mysqli_query(
    $conn,
    "UPDATE maintenance_mode SET is_active = $newStatus WHERE id = 1"
);

echo json_encode([
    "success" => true,
    "is_maintenance" => $newStatus
]);
?>