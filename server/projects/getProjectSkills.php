<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$result = mysqli_query($conn, "SELECT * FROM project_skills ORDER BY name ASC");

$skills = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $skills[] = $row;
    }
}

echo json_encode($skills);
?>