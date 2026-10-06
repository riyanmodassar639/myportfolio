<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$slug = isset($_GET["slug"]) ? mysqli_real_escape_string($conn, $_GET["slug"]) : "";

if (empty($slug)) {
    echo json_encode(["success" => false, "error" => "No slug provided."]);
    exit;
}

$result = mysqli_query(
    $conn,
    "SELECT * FROM blog_posts WHERE slug='$slug' AND is_published = 1 LIMIT 1"
);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(["success" => false, "error" => "Post not found."]);
    exit;
}

$row = mysqli_fetch_assoc($result);

if (!empty($row["cover_image"])) {
    $row["cover_image"] = "https://riyanportfolio.site.je/server/" . $row["cover_image"];
}

echo json_encode(["success" => true, "post" => $row]);
?>