<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$query = mysqli_query(
    $conn,
    "SELECT * FROM education ORDER BY id DESC"
);

$education = [];

if ($query) {

    while (
        $row = mysqli_fetch_assoc($query)
    ) {

        $education[] = $row;
    }
}

echo json_encode([
    "education" => $education
]);

?>