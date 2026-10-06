<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$id = (int)$data["id"];

$year = mysqli_real_escape_string(
    $conn,
    $data["year"]
);

$title = mysqli_real_escape_string(
    $conn,
    $data["title"]
);

$institute = mysqli_real_escape_string(
    $conn,
    $data["institute"]
);

$description = mysqli_real_escape_string(
    $conn,
    $data["description"]
);

mysqli_query(
    $conn,

    "UPDATE education

     SET

     year='$year',
     title='$title',
     institute='$institute',
     description='$description'

     WHERE id=$id"
);

echo json_encode([
    "success" => true
]);

?>