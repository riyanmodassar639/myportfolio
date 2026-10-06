<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["id"]) ? (int)$data["id"] : 0;
$newRating = isset($data["rating"]) ? (int)$data["rating"] : 0;

if ($id <= 0 || $newRating < 1 || $newRating > 5) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid project id or rating value."
    ]);
    exit;
}

$result = mysqli_query($conn, "SELECT rating, rating_count FROM projects WHERE id=$id");

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode([
        "success" => false,
        "error" => "Project not found."
    ]);
    exit;
}

$row = mysqli_fetch_assoc($result);
$currentRating = (float)$row["rating"];
$currentCount = (int)$row["rating_count"];

// running average: fold the new vote into the existing average
$updatedCount = $currentCount + 1;
$updatedRating = (($currentRating * $currentCount) + $newRating) / $updatedCount;
$updatedRating = round($updatedRating, 1);

$update = mysqli_query(
    $conn,
    "UPDATE projects SET rating='$updatedRating', rating_count='$updatedCount' WHERE id=$id"
);

if ($update) {
    echo json_encode([
        "success" => true,
        "rating" => $updatedRating,
        "rating_count" => $updatedCount
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => mysqli_error($conn)
    ]);
}
?>