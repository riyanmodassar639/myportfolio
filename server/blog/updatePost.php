<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$id = isset($_POST["id"]) ? (int)$_POST["id"] : 0;
$title = trim($_POST["title"] ?? "");
$excerpt = $_POST["excerpt"] ?? "";
$content = $_POST["content"] ?? "";
$isPublished = isset($_POST["is_published"]) ? (int)$_POST["is_published"] : 1;

if ($id <= 0 || empty($title)) {
    echo json_encode(["success" => false, "error" => "Invalid post id or missing title."]);
    exit;
}

$titleEsc = mysqli_real_escape_string($conn, $title);
$excerptEsc = mysqli_real_escape_string($conn, $excerpt);
$contentEsc = mysqli_real_escape_string($conn, $content);

$uploadDir = "../uploads/blog/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$coverImageSql = "";
if (isset($_FILES["cover_image"]) && (int)$_FILES["cover_image"]["error"] === UPLOAD_ERR_OK) {
    $fileName = time() . "_" . basename($_FILES["cover_image"]["name"]);
    $target = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["cover_image"]["tmp_name"], $target)) {
        $coverImage = mysqli_real_escape_string($conn, "uploads/blog/" . $fileName);
        $coverImageSql = ", cover_image='$coverImage'";
    }
}

$query = "UPDATE blog_posts SET
            title='$titleEsc',
            excerpt='$excerptEsc',
            content='$contentEsc',
            is_published=$isPublished
            $coverImageSql
          WHERE id=$id";

if (mysqli_query($conn, $query)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}
?>