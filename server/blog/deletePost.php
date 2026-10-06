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

$result = mysqli_query($conn, "SELECT cover_image FROM blog_posts WHERE id=$id LIMIT 1");
$row = $result ? mysqli_fetch_assoc($result) : null;

if ($row && !empty($row["cover_image"])) {
    $path = "../" . $row["cover_image"];
    if (file_exists($path)) {
        @unlink($path);
    }
}

if (mysqli_query($conn, "DELETE FROM blog_posts WHERE id=$id")) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}
?>