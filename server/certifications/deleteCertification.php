<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(
file_get_contents("php://input"),
true
);

$id = (int)$data["id"];

mysqli_query(
$conn,
"DELETE FROM certifications
WHERE id=$id"
);

echo json_encode([
"success"=>true
]);