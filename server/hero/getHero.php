<?php
header("Access-Control-Allow-Origin: https://riyanportfolio.site.je");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include("../config/db.php");

$result = mysqli_query(
    $conn,
    "SELECT * FROM hero_section WHERE is_live=1 ORDER BY id DESC LIMIT 1"
);

if ($result === false) {
    echo json_encode([
        "error" => "Database error: " . mysqli_error($conn)
    ]);
    exit;
}

$hero = null;

if (mysqli_num_rows($result) > 0) {
    $hero = mysqli_fetch_assoc($result);
}

echo json_encode($hero);
?>