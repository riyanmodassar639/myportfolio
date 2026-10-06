<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("../config/db.php");

$year = mysqli_real_escape_string($conn, $_POST['year']);
$certificate_name = mysqli_real_escape_string($conn, $_POST['certificate_name']);
$organization = mysqli_real_escape_string($conn, $_POST['organization']);
$description = mysqli_real_escape_string($conn, $_POST['description']);
$credential_link = mysqli_real_escape_string($conn, $_POST['credential_link']);

$imagePath = "";

if(isset($_FILES['certificate_image']))
{
    $fileName = time() . "_" . $_FILES['certificate_image']['name'];

    $target =
    "../uploads/certificates/" . $fileName;

    move_uploaded_file(
        $_FILES['certificate_image']['tmp_name'],
        $target
    );

    $imagePath =
    "uploads/certificates/" . $fileName;
}

mysqli_query(
$conn,
"INSERT INTO certifications
(
year,
certificate_name,
organization,
description,
certificate_image,
credential_link
)
VALUES
(
'$year',
'$certificate_name',
'$organization',
'$description',
'$imagePath',
'$credential_link'
)"
);

echo json_encode([
"success"=>true
]);