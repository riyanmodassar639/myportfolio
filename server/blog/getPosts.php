<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$publishedOnly = isset($_GET["published_only"]) && $_GET["published_only"] === "1";

$query = "SELECT * FROM blog_posts";
if ($publishedOnly) {
    $query .= " WHERE is_published = 1";
}
$query .= " ORDER BY created_at DESC";

$result = mysqli_query($conn, $query);
$posts = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        if (!empty($row["cover_image"])) {
            $row["cover_image"] = "https://riyanportfolio.site.je/server/" . $row["cover_image"];
        }
        $posts[] = $row;
    }
}

echo json_encode($posts);
?>