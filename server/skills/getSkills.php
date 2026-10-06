<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

/* =========================
   GET ALL SKILLS
========================= */

$query = mysqli_query(
    $conn,
    "SELECT * FROM skills ORDER BY id DESC"
);

$skills = [];

if ($query) {
    while ($row = mysqli_fetch_assoc($query)) {
        $skills[] = $row;
    }
}

echo json_encode([
    "skills" => $skills
]);
?>