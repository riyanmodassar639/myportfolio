<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$year = trim($data["year"] ?? "");
$title = trim($data["title"] ?? "");
$institute = trim($data["institute"] ?? "");
$description = trim($data["description"] ?? "");

if (
    $year === "" ||
    $title === "" ||
    $institute === "" ||
    $description === ""
) {
    echo json_encode([
        "success" => false,
        "error" => "All fields are required."
    ]);
    exit;
}

$year = mysqli_real_escape_string($conn, $year);
$title = mysqli_real_escape_string($conn, $title);
$institute = mysqli_real_escape_string($conn, $institute);
$description = mysqli_real_escape_string($conn, $description);

$result = mysqli_query(
    $conn,
    "INSERT INTO education
    (
        year,
        title,
        institute,
        description
    )
    VALUES
    (
        '$year',
        '$title',
        '$institute',
        '$description'
    )"
);

echo json_encode([
    "success" => $result
]);
?>