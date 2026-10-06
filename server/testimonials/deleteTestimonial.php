<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../config/db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data || !isset($data["id"])) {

    echo json_encode([
        "success" => false,
        "message" => "ID missing"
    ]);

    exit;
}

$id = intval($data["id"]);

$stmt = $conn->prepare(
    "DELETE FROM testimonials WHERE id=?"
);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "deleted_id" => $id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}