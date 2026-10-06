<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../config/db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$subject = $data["subject"] ?? "";
$message = $data["message"] ?? "";

if(
    empty($name) ||
    empty($email) ||
    empty($subject) ||
    empty($message)
){
    echo json_encode([
        "success" => false,
        "message" => "All fields required"
    ]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO contact_messages
    (name,email,subject,message)
    VALUES (?,?,?,?)"
);

$stmt->bind_param(
    "ssss",
    $name,
    $email,
    $subject,
    $message
);

if($stmt->execute()){

    echo json_encode([
        "success" => true
    ]);

}else{

    echo json_encode([
        "success" => false
    ]);
}
?>