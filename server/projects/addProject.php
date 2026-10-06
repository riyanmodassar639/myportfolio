<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$title = mysqli_real_escape_string($conn, $_POST["title"] ?? "");
$description = mysqli_real_escape_string($conn, $_POST["description"] ?? "");
$github = mysqli_real_escape_string($conn, $_POST["github"] ?? "");
$live = mysqli_real_escape_string($conn, $_POST["live"] ?? "");
$technologies = mysqli_real_escape_string($conn, $_POST["technologies"] ?? "");
$category = mysqli_real_escape_string($conn, $_POST["category"] ?? "");

$show_github = isset($_POST["show_github"]) ? (int)$_POST["show_github"] : 0;
$show_live_demo = isset($_POST["show_live_demo"]) ? (int)$_POST["show_live_demo"] : 0;
$show_view_detail = isset($_POST["show_view_detail"]) ? (int)$_POST["show_view_detail"] : 0;

$build_process = mysqli_real_escape_string($conn, $_POST["build_process"] ?? "");

$uploadDir = "../uploads/projects/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

function handleProjectUpload($fieldName, $uploadDir, &$uploadErrors)
{
    if (!isset($_FILES[$fieldName]) || (int)$_FILES[$fieldName]["error"] === UPLOAD_ERR_NO_FILE) {
        return "";
    }

    if ((int)$_FILES[$fieldName]["error"] !== UPLOAD_ERR_OK) {
        $uploadErrors[] = "$fieldName upload failed (error code " . $_FILES[$fieldName]["error"] . " — the file may be too large; check your php.ini upload_max_filesize / post_max_size).";
        return "";
    }

    if ($_FILES[$fieldName]["size"] <= 0) {
        return "";
    }

    $fileName = time() . "_" . basename($_FILES[$fieldName]["name"]);
    $target = $uploadDir . $fileName;

    if (!move_uploaded_file($_FILES[$fieldName]["tmp_name"], $target)) {
        $uploadErrors[] = "$fieldName upload failed — could not save the file to the server (check that the uploads/projects folder is writable).";
        return "";
    }

    return "uploads/projects/" . $fileName;
}

$uploadErrors = [];
$image = mysqli_real_escape_string(
    $conn,
    handleProjectUpload("image", $uploadDir, $uploadErrors)
);

$documentation = mysqli_real_escape_string(
    $conn,
    handleProjectUpload("documentation", $uploadDir, $uploadErrors)
);

$presentation = mysqli_real_escape_string(
    $conn,
    handleProjectUpload("presentation", $uploadDir, $uploadErrors)
);

$video_link = mysqli_real_escape_string(
    $conn,
    handleProjectUpload("video_link", $uploadDir, $uploadErrors)
);

// rating & rating_count are NOT set here — they belong to visitors
// rating the live project, and start at the column defaults.
$query = "INSERT INTO projects
(
title,
description,
image,
github_link,
live_link,
technologies,
category,
show_github,
show_live_demo,
show_view_detail,
build_process,
documentation,
presentation,
video_link
)

VALUES
(
'$title',
'$description',
'$image',
'$github',
'$live',
'$technologies',
'$category',
'$show_github',
'$show_live_demo',
'$show_view_detail',
'$build_process',
'$documentation',
'$presentation',
'$video_link'
)";

$result = mysqli_query($conn, $query);

if ($result) {
    echo json_encode([
        "success" => true,
        "uploadErrors" => $uploadErrors
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn),
        "uploadErrors" => $uploadErrors
    ]);
}
?>