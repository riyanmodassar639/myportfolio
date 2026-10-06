<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$duration    = trim($data["duration"] ?? "");
$job_title   = trim($data["job_title"] ?? "");
$company     = trim($data["company"] ?? "");
$description = trim($data["description"] ?? "");

if (
    $duration === "" ||
    $job_title === "" ||
    $company === "" ||
    $description === ""
) {
    echo json_encode([
        "success" => false,
        "error" => "All fields are required."
    ]);
    exit;
}

$duration = mysqli_real_escape_string($conn, $duration);
$job_title = mysqli_real_escape_string($conn, $job_title);
$company = mysqli_real_escape_string($conn, $company);
$description = mysqli_real_escape_string($conn, $description);

$result = mysqli_query(
    $conn,
    "INSERT INTO experience
    (duration, job_title, company, description)
    VALUES
    ('$duration', '$job_title', '$company', '$description')"
);

echo json_encode([
    "success" => $result
]);