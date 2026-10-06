<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$name = isset($data["name"]) ? trim($data["name"]) : "";

if ($name === "") {
    echo json_encode([
        "success" => false,
        "error" => "Skill name is required."
    ]);
    exit;
}

$name = mysqli_real_escape_string($conn, $name);

$check = mysqli_query(
    $conn,
    "SELECT id FROM project_skills WHERE LOWER(name)=LOWER('$name')"
);

if ($check && mysqli_num_rows($check) > 0) {
    echo json_encode([
        "success" => false,
        "error" => "This skill already exists."
    ]);
    exit;
}

$result = mysqli_query(
    $conn,
    "INSERT INTO project_skills (name) VALUES ('$name')"
);

if ($result) {
    echo json_encode([
        "success" => true,
        "id" => mysqli_insert_id($conn),
        "name" => $name
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);
}
?>