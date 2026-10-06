<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$heading = mysqli_real_escape_string($conn, $data["heading"]);
$description = mysqli_real_escape_string($conn, $data["description"]);

$projects = mysqli_real_escape_string($conn, $data["projects"]);
$satisfaction = mysqli_real_escape_string($conn, $data["satisfaction"]);
$experience = mysqli_real_escape_string($conn, $data["experience"]);

mysqli_query(
    $conn,
    "INSERT INTO about_section
    (
        heading,
        description,
        projects_completed,
        client_satisfaction,
        years_experience
    )

    VALUES
    (
        '$heading',
        '$description',
        '$projects',
        '$satisfaction',
        '$experience'
    )"
);

echo json_encode([
    "success" => true
]);
?>