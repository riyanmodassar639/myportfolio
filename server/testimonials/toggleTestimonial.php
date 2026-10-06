<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "ID missing"
    ]);
    exit;
}

$id = intval($data["id"]);

$get = $conn->query(
    "SELECT is_live
     FROM testimonials
     WHERE id = $id"
);

if ($get->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Record not found"
    ]);
    exit;
}

$row = $get->fetch_assoc();

$newStatus =
    ($row["is_live"] == 1)
    ? 0
    : 1;

$update = $conn->query(
    "UPDATE testimonials
     SET is_live = $newStatus
     WHERE id = $id"
);

if ($update) {
    echo json_encode([
        "success" => true,
        "status" => $newStatus
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
}