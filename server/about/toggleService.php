<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = (int)$data["id"];

$get = mysqli_query(
    $conn,
    "SELECT is_live FROM about_services WHERE id = $id"
);

$row = mysqli_fetch_assoc($get);

$newValue = $row["is_live"] == 1 ? 0 : 1;

mysqli_query(
    $conn,
    "UPDATE about_services
     SET is_live = $newValue
     WHERE id = $id"
);

echo json_encode([
    "success" => true
]);
?>