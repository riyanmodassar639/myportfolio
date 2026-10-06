<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["id"]) ? (int)$data["id"] : 0;

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid skill id."
    ]);
    exit;
}

$result = mysqli_query($conn, "DELETE FROM project_skills WHERE id=$id");

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);
}
?>