<?php
session_start();

header("Access-Control-Allow-Origin: ");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$email = mysqli_real_escape_string($conn, trim($data["email"] ?? ""));
$password = trim($data["password"] ?? "");

if ($email == "" || $password == "") {
    echo json_encode([
        "success" => false,
        "message" => "Email and Password are required."
    ]);
    exit;
}

$query = mysqli_query(
    $conn,
    "SELECT * FROM admin WHERE email='$email' LIMIT 1"
);

if (mysqli_num_rows($query) == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid Email or Password."
    ]);
    exit;
}

$admin = mysqli_fetch_assoc($query);

// Temporary (plain password)
if ($password !== $admin["password"]) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid Email or Password."
    ]);
    exit;
}

$_SESSION["admin_id"] = $admin["id"];
$_SESSION["admin_email"] = $admin["email"];

echo json_encode([
    "success" => true,
    "message" => "Login Successful",
    "admin" => [
        "id" => $admin["id"],
        "email" => $admin["email"]
    ]
]);
?>