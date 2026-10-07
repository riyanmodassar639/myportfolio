<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$query = mysqli_query(
    $conn,
    "SELECT p.*, 
     (SELECT image FROM project_screenshots WHERE project_id = p.id AND is_thumbnail = 1 LIMIT 1) as thumb_image 
     FROM projects p ORDER BY p.id DESC"
);

$projects = [];

while ($row = mysqli_fetch_assoc($query)) {

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