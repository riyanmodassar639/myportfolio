<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../config/db.php";

$result = $conn->query(
    "SELECT *
     FROM contact_messages
     ORDER BY id DESC"
);

$messages = [];

while(
    $row = $result->fetch_assoc()
){
    $messages[] = $row;
}

echo json_encode([
    "messages" => $messages
]);
?>