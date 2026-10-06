<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include "../config/db.php";

$rawData = file_get_contents("php://input");

$data = json_decode($rawData, true);

if (!$data) {

    echo json_encode([
        "success" => false,
        "message" => "No data received",
        "raw" => $rawData
    ]);

    exit;
}

$client_name = $data["client_name"] ?? "";
$designation = $data["designation"] ?? "";
$message = $data["message"] ?? "";
$rating = $data["rating"] ?? 5;

if (
    empty($client_name) ||
    empty($designation) ||
    empty($message)
) {

    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);

    exit;
}

$sql = "INSERT INTO testimonials
(
    client_name,
    designation,
    message,
    rating,
    is_live
)
VALUES
(
    ?, ?, ?, ?, 0
)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssi",
    $client_name,
    $designation,
    $message,
    $rating
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Testimonial submitted successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>