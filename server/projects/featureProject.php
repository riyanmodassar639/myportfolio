<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = (int)$data["id"];

$result = mysqli_query(
    $conn,
    "SELECT is_featured FROM projects WHERE id=$id"
);

$row = mysqli_fetch_assoc($result);

$newStatus = $row["is_featured"] == 1 ? 0 : 1;

mysqli_query(
    $conn,
    "UPDATE projects
     SET is_featured=$newStatus
     WHERE id=$id"
);

echo json_encode([
    "success" => true
]);
?>