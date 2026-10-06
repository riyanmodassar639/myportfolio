<?php

$host = "sql302.infinityfree.com";
$user = "if0_42412448";
$password = "AKt7t0mCuyB3";
$database = "if0_42412448_portfolio";

$conn = mysqli_connect($host, $user, $password, $database);

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>