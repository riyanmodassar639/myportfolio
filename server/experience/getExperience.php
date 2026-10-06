<?php
// --- Debugging: log errors to a file instead of printing them (keeps JSON clean) ---
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Make sure fatal errors still return valid JSON instead of a blank page
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Fatal error: " . $error['message'] . " in " . $error['file'] . " on line " . $error['line']
        ]);
    }
});

include("../config/db.php");

if (!$conn) {
    echo json_encode([
        "success" => false,
        "error" => "Database connection is null after include"
    ]);
    exit;
}

$query = mysqli_query(
    $conn,
    "SELECT * FROM `experience` WHERE is_live = 1 ORDER BY id DESC"
);

if (!$query) {
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);
    exit;
}

$experience = [];
while ($row = mysqli_fetch_assoc($query)) {
    $experience[] = $row;
}

echo json_encode([
    "success" => true,
    "experience" => $experience
]);
exit;