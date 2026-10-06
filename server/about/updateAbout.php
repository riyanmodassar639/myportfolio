<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = (int)$data["id"];

$heading = mysqli_real_escape_string($conn, $data["heading"]);
$description = mysqli_real_escape_string($conn, $data["description"]);

$projects = mysqli_real_escape_string($conn, $data["projects"]);
$satisfaction = mysqli_real_escape_string($conn, $data["satisfaction"]);
$experience = mysqli_real_escape_string($conn, $data["experience"]);

mysqli_query(
    $conn,
    "UPDATE about_section

     SET
     heading='$heading',
     description='$description',
     projects_completed='$projects',
     client_satisfaction='$satisfaction',
     years_experience='$experience',
     is_live=1

     WHERE id=$id"
);

mysqli_query(
    $conn,
    "UPDATE about_section
     SET is_live=0
     WHERE id != $id"
);

echo json_encode([
    "success" => true
]);
?>