<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$id = isset($_POST["id"]) ? (int)$_POST["id"] : 0;

$greeting = mysqli_real_escape_string($conn, $_POST["greeting"] ?? "Hello,");
$title = mysqli_real_escape_string($conn, $_POST["title"] ?? "");
$role = mysqli_real_escape_string($conn, $_POST["role"] ?? "");
$description = mysqli_real_escape_string($conn, $_POST["description"] ?? "");
$skills = mysqli_real_escape_string($conn, $_POST["skills"] ?? "");

$btn1_text = mysqli_real_escape_string($conn, $_POST["btn1_text"] ?? "View Projects");
$btn1_link = mysqli_real_escape_string($conn, $_POST["btn1_link"] ?? "#projects");
$btn2_text = mysqli_real_escape_string($conn, $_POST["btn2_text"] ?? "Contact Me");
$btn2_link = mysqli_real_escape_string($conn, $_POST["btn2_link"] ?? "#contact");

$uploadDir = "../uploads/hero/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$newImagePath = null;

if (
    isset($_FILES["profile_image"]) &&
    $_FILES["profile_image"]["error"] === 0 &&
    $_FILES["profile_image"]["size"] > 0
) {
    $fileName = time() . "_" . basename($_FILES["profile_image"]["name"]);
    $target = $uploadDir . $fileName;
    move_uploaded_file($_FILES["profile_image"]["tmp_name"], $target);
    $newImagePath = "uploads/hero/" . $fileName;
}

$newResumePath = null;

if (
    isset($_FILES["resume_link"]) &&
    $_FILES["resume_link"]["error"] === 0 &&
    $_FILES["resume_link"]["size"] > 0
) {
    $fileName = time() . "_" . basename($_FILES["resume_link"]["name"]);
    $target = $uploadDir . $fileName;
    move_uploaded_file($_FILES["resume_link"]["tmp_name"], $target);
    $newResumePath = "uploads/hero/" . $fileName;
}

if ($id > 0) {
    // editing/re-saving an existing row
    $existing = mysqli_query(
        $conn,
        "SELECT profile_image, resume_link FROM hero_section WHERE id=$id"
    );

    if ($existing === false) {
        echo json_encode([
            "success" => false,
            "error" => "Database error: " . mysqli_error($conn)
        ]);
        exit;
    }

    $row = mysqli_fetch_assoc($existing);

    $profile_image = $newImagePath !== null
        ? $newImagePath
        : ($row["profile_image"] ?? "");

    $profile_image = mysqli_real_escape_string($conn, $profile_image);

    $resume_link = $newResumePath !== null
        ? $newResumePath
        : ($row["resume_link"] ?? "");

    $resume_link = mysqli_real_escape_string($conn, $resume_link);

    $result = mysqli_query(
        $conn,
        "UPDATE hero_section SET
            greeting='$greeting',
            title='$title',
            role='$role',
            description='$description',
            skills='$skills',
            profile_image='$profile_image',
            resume_link='$resume_link',
            btn1_text='$btn1_text',
            btn1_link='$btn1_link',
            btn2_text='$btn2_text',
            btn2_link='$btn2_link',
            is_live=1
        WHERE id=$id"
    );
} else {
    // no row yet — insert a brand new one
    $profile_image = $newImagePath !== null
        ? mysqli_real_escape_string($conn, $newImagePath)
        : "";

    $resume_link = $newResumePath !== null
        ? mysqli_real_escape_string($conn, $newResumePath)
        : "";

    $result = mysqli_query(
        $conn,
        "INSERT INTO hero_section
            (greeting, title, role, description, skills, profile_image, resume_link,
             btn1_text, btn1_link, btn2_text, btn2_link, is_live)
        VALUES
            ('$greeting', '$title', '$role', '$description', '$skills', '$profile_image', '$resume_link',
             '$btn1_text', '$btn1_link', '$btn2_text', '$btn2_link', 1)"
    );

    $id = mysqli_insert_id($conn);
}

if ($result === false) {
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . mysqli_error($conn)
    ]);
    exit;
}

// make sure this is the ONLY live row, so the public site never
// shows two different Hero versions at once
mysqli_query($conn, "UPDATE hero_section SET is_live=0 WHERE id != $id");

echo json_encode([
    "success" => true,
    "id" => $id
]);
?>