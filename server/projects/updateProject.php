<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$id = isset($_POST["id"]) ? (int)$_POST["id"] : 0;

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

// returns the new relative path if a file was uploaded, or null
// if nothing was uploaded (meaning: leave the existing file alone)
function handleProjectUpload($fieldName, $uploadDir, &$uploadErrors)
{
    if (!isset($_FILES[$fieldName]) || (int)$_FILES[$fieldName]["error"] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ((int)$_FILES[$fieldName]["error"] !== UPLOAD_ERR_OK) {
        $uploadErrors[] = "$fieldName upload failed (error code " . $_FILES[$fieldName]["error"] . " — the file may be too large; check your php.ini upload_max_filesize / post_max_size).";
        return null;
    }

    if ($_FILES[$fieldName]["size"] <= 0) {
        return null;
    }

    $fileName = time() . "_" . basename($_FILES[$fieldName]["name"]);
    $target = $uploadDir . $fileName;

    if (!move_uploaded_file($_FILES[$fieldName]["tmp_name"], $target)) {
        $uploadErrors[] = "$fieldName upload failed — could not save the file to the server (check that the uploads/projects folder is writable).";
        return null;
    }

    return "uploads/projects/" . $fileName;
}

$uploadErrors = [];
$image = handleProjectUpload("image", $uploadDir, $uploadErrors);
$documentation = handleProjectUpload("documentation", $uploadDir, $uploadErrors);
$presentation = handleProjectUpload("presentation", $uploadDir, $uploadErrors);
$video_link = handleProjectUpload("video_link", $uploadDir, $uploadErrors);

$extraSQL = "";

if ($image !== null) {
    $image = mysqli_real_escape_string($conn, $image);
    $extraSQL .= ", image='$image'";
}
if ($documentation !== null) {
    $documentation = mysqli_real_escape_string($conn, $documentation);
    $extraSQL .= ", documentation='$documentation'";
}

if ($presentation !== null) {
    $presentation = mysqli_real_escape_string($conn, $presentation);
    $extraSQL .= ", presentation='$presentation'";
}

if ($video_link !== null) {
    $video_link = mysqli_real_escape_string($conn, $video_link);
    $extraSQL .= ", video_link='$video_link'";
}

// rating & rating_count are intentionally never touched here —
// only visitors rating the live project (rateProject.php) can change them.
$query = "UPDATE projects SET

title='$title',
description='$description',
github_link='$github',
live_link='$live',
technologies='$technologies',
category='$category',
show_github='$show_github',
show_live_demo='$show_live_demo',
show_view_detail='$show_view_detail',
build_process='$build_process'
$extraSQL

WHERE id=$id";

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