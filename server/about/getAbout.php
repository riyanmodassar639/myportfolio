<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include("../config/db.php");

/* =========================
   GET LIVE ABOUT SECTION
========================= */

$sectionQuery = mysqli_query(
    $conn,
    "SELECT * FROM about_section 
     WHERE is_live = 1
     ORDER BY id DESC 
     LIMIT 1"
);

$section = null;

if ($sectionQuery && mysqli_num_rows($sectionQuery) > 0) {
    $section = mysqli_fetch_assoc($sectionQuery);
}

/* =========================
   GET ALL ABOUT CONTENT
========================= */

$allQuery = mysqli_query(
    $conn,
    "SELECT * FROM about_section ORDER BY id DESC"
);

$sections = [];

while ($row = mysqli_fetch_assoc($allQuery)) {
    $sections[] = $row;
}

/* =========================
   GET SERVICES
========================= */

$servicesQuery = mysqli_query(
    $conn,
    "SELECT * FROM about_services ORDER BY id DESC"
);

$services = [];

while ($row = mysqli_fetch_assoc($servicesQuery)) {
    $services[] = $row;
}

/* =========================
   RETURN JSON
========================= */

echo json_encode([
    "section" => $section,
    "sections" => $sections,
    "services" => $services
]);
?>