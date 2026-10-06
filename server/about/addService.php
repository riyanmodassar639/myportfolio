<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
header("Content-Type: application/json");
include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$title = mysqli_real_escape_string($conn, $data["title"]);
$description = mysqli_real_escape_string($conn, $data["description"]);

mysqli_query(
    $conn,
    "INSERT INTO about_services (title, description) VALUES ('$title', '$description')"
);

echo json_encode(["success" => true]);
?>