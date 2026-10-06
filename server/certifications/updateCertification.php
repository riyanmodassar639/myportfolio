<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("../config/db.php");

$id = (int)$_POST["id"];

$year = mysqli_real_escape_string($conn,$_POST['year']);
$certificate_name = mysqli_real_escape_string($conn,$_POST['certificate_name']);
$organization = mysqli_real_escape_string($conn,$_POST['organization']);
$description = mysqli_real_escape_string($conn,$_POST['description']);
$credential_link = mysqli_real_escape_string($conn,$_POST['credential_link']);

$imageSQL = "";

if(isset($_FILES['certificate_image']))
{
    $fileName =
    time() . "_" .
    $_FILES['certificate_image']['name'];

    $target =
    "../uploads/certificates/" .
    $fileName;

    move_uploaded_file(
        $_FILES['certificate_image']['tmp_name'],
        $target
    );

    $imagePath =
    "uploads/certificates/" .
    $fileName;

    $imageSQL =
    ", certificate_image='$imagePath'";
}

mysqli_query(
$conn,
"UPDATE certifications
SET
year='$year',
certificate_name='$certificate_name',
organization='$organization',
description='$description',
credential_link='$credential_link'
$imageSQL
WHERE id=$id"
);

echo json_encode([
"success"=>true
]);