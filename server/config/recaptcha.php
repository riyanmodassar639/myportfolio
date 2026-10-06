<?php
// ===================================================================
// Get your keys from: https://www.google.com/recaptcha/admin/create
// - Choose reCAPTCHA v2 -> "I'm not a robot" Checkbox
// - Add domain: riyanportfolio.site.je
// Then paste the SITE KEY below in Contact.jsx (data-sitekey) and the
// SECRET KEY below.
// ===================================================================

define("RECAPTCHA_SECRET_KEY", "YOUR_RECAPTCHA_SECRET_KEY");

// Verifies a reCAPTCHA response token with Google. Returns true/false.
function verifyRecaptcha($token)
{
    if (empty($token)) {
        return false;
    }

    $ch = curl_init("https://www.google.com/recaptcha/api/siteverify");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        "secret" => RECAPTCHA_SECRET_KEY,
        "response" => $token,
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    curl_close($ch);

    if (!$response) {
        return false;
    }

    $result = json_decode($response, true);
    return isset($result["success"]) && $result["success"] === true;
}
?>