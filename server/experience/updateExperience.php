<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = (int)$data["id"];

$duration = mysqli_real_escape_string($conn,$data["duration"]);
$job_title = mysqli_real_escape_string($conn,$data["job_title"]);
$company = mysqli_real_escape_string($conn,$data["company"]);
$description = mysqli_real_escape_string($conn,$data["description"]);

mysqli_query(
$conn,
"UPDATE experience
SET
duration='$duration',
job_title='$job_title',
company='$company',
description='$description'
WHERE id=$id"
);

echo json_encode([
"success"=>true
]);