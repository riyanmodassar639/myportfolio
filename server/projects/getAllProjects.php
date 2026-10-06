<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$query = mysqli_query(
    $conn,
    "SELECT * FROM projects ORDER BY id DESC"
);

$projects = [];

while ($row = mysqli_fetch_assoc($query)) {

    if (!empty($row["image"])) {
        $row["image"] = "https://riyanportfolio.site.je/server/" . $row["image"];
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