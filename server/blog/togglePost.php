<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data["id"]) ? (int)$data["id"] : 0;

if ($id <= 0) {
    echo json_encode(["success" => false, "error" => "Invalid post id."]);
    exit;
}

$result = mysqli_query($conn, "SELECT is_published FROM blog_posts WHERE id=$id LIMIT 1");
$row = $result ? mysqli_fetch_assoc($result) : null;

if (!$row) {
    echo json_encode(["success" => false, "error" => "Post not found."]);
    exit;
}

$newStatus = (int)$row["is_published"] === 1 ? 0 : 1;
mysqli_query($conn, "UPDATE blog_posts SET is_published=$newStatus WHERE id=$id");

echo json_encode(["success" => true, "is_published" => $newStatus]);
?>