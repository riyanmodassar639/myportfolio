<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = (int)$data["id"];

$name = mysqli_real_escape_string($conn, $data["name"]);
$percentage = mysqli_real_escape_string($conn, $data["percentage"]);

mysqli_query(
    $conn,
    "UPDATE skills
     SET name='$name',
     percentage='$percentage'
     WHERE id=$id"
);

echo json_encode([
    "success" => true
]);
?>