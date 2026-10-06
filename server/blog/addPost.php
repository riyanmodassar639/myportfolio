<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$title = trim($_POST["title"] ?? "");
$excerpt = $_POST["excerpt"] ?? "";
$content = $_POST["content"] ?? "";
$isPublished = isset($_POST["is_published"]) ? (int)$_POST["is_published"] : 1;

if (empty($title)) {
    echo json_encode(["success" => false, "error" => "Title is required."]);
    exit;
}

// slugify the title, then make sure it's unique
function slugify($text)
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-');
}

$baseSlug = slugify($title);
if (empty($baseSlug)) {
    $baseSlug = "post";
}

$slug = $baseSlug;
$suffix = 2;

while (true) {
    $escapedSlug = mysqli_real_escape_string($conn, $slug);
    $check = mysqli_query($conn, "SELECT id FROM blog_posts WHERE slug='$escapedSlug' LIMIT 1");
    if (!$check || mysqli_num_rows($check) === 0) {
        break;
    }
    $slug = $baseSlug . "-" . $suffix;
    $suffix++;
}

$uploadDir = "../uploads/blog/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$coverImage = "";
if (isset($_FILES["cover_image"]) && (int)$_FILES["cover_image"]["error"] === UPLOAD_ERR_OK) {
    $fileName = time() . "_" . basename($_FILES["cover_image"]["name"]);
    $target = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["cover_image"]["tmp_name"], $target)) {
        $coverImage = "uploads/blog/" . $fileName;
    }
}

$titleEsc = mysqli_real_escape_string($conn, $title);
$slugEsc = mysqli_real_escape_string($conn, $slug);
$excerptEsc = mysqli_real_escape_string($conn, $excerpt);
$contentEsc = mysqli_real_escape_string($conn, $content);
$coverImageEsc = mysqli_real_escape_string($conn, $coverImage);

$query = "INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, is_published)
          VALUES ('$titleEsc', '$slugEsc', '$excerptEsc', '$contentEsc', '$coverImageEsc', $isPublished)";

if (mysqli_query($conn, $query)) {
    echo json_encode([
        "success" => true,
        "id" => mysqli_insert_id($conn),
        "slug" => $slug
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);
}
?>