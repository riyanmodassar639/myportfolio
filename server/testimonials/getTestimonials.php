<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../config/db.php";

$result = $conn->query(
    "SELECT * FROM testimonials
     ORDER BY id DESC"
);

$testimonials = [];

while($row = $result->fetch_assoc()){
    $testimonials[] = $row;
}

echo json_encode([
    "testimonials" => $testimonials
]);