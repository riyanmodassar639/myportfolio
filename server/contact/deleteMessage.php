<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../config/db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$id = $data["id"];

$stmt = $conn->prepare(
    "DELETE FROM contact_messages
     WHERE id=?"
);

$stmt->bind_param(
    "i",
    $id
);

$stmt->execute();

echo json_encode([
    "success" => true
]);
?>