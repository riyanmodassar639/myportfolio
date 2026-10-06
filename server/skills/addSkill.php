<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$percentage = trim($data["percentage"] ?? "");

if ($name === "" || $percentage === "") {
    echo json_encode([
        "success" => false,
        "error" => "Skill name and percentage are required."
    ]);
    exit;
}

$name = mysqli_real_escape_string($conn, $name);
$percentage = mysqli_real_escape_string($conn, $percentage);

$result = mysqli_query(
    $conn,
    "INSERT INTO skills (name, percentage)
     VALUES ('$name', '$percentage')"
);

echo json_encode([
    "success" => $result
]);