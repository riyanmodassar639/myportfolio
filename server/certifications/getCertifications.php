<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$result = mysqli_query(
$conn,
"SELECT * FROM certifications ORDER BY id DESC"
);

$data = [];

while($row = mysqli_fetch_assoc($result))
{
    $data[] = $row;
}

echo json_encode([
"certifications"=>$data
]);