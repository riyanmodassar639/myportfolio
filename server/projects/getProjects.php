<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$sql = "SELECT p.*, 
       (SELECT image FROM project_screenshots WHERE project_id = p.id AND is_thumbnail = 1 LIMIT 1) as thumb_image 
        FROM projects p WHERE p.is_live=1 ORDER BY p.is_featured DESC, p.id DESC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        "error" => mysqli_error($conn)
    ]);
    exit;
}

$projects = [];

while ($row = mysqli_fetch_assoc($result)) {

    // If a specific thumbnail screenshot is set, use it. Otherwise, use the original main image.
    $final_image = !empty($row["thumb_image"]) ? $row["thumb_image"] : $row["image"];
    if (!empty($final_image)) {
        $row["image"] = "https://riyanportfolio.site.je/server/" . $final_image;
    }

    if (!empty($row["documentation"])) {
        $row["documentation"] = "https://riyanportfolio.site.je/server/" . $row["documentation"];
    }

    if (!empty($row["presentation"])) {
        $row["presentation"] = "https://riyanportfolio.site.je/server/" . $row["presentation"];
    }

    if (!empty($row["video_link"])) {
        $row["video_link"] = "https://riyanportfolio.site.je/server/" . $row["video_link"];
    }


    $projects[] = $row;
}

echo json_encode($projects);

?>