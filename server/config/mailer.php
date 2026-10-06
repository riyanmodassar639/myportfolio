<?php
require_once __DIR__ . "/../PHPMailer/src/PHPMailer.php";
require_once __DIR__ . "/../PHPMailer/src/SMTP.php";
require_once __DIR__ . "/../PHPMailer/src/Exception.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ===================================================================
// EDIT THESE WITH YOUR OWN DETAILS.
//
// Easiest option: use a Gmail account.
// 1. Turn on 2-Step Verification on that Gmail account:
//    https://myaccount.google.com/security
// 2. Create an "App Password":
//    https://myaccount.google.com/apppasswords
//    (choose app: Mail, device: Other -> "Portfolio Website")
// 3. Paste the 16-character app password below (NOT your normal Gmail
//    password).
// ===================================================================

define("SMTP_HOST", "smtp.gmail.com");
define("SMTP_PORT", 587);
define("SMTP_USERNAME", "youremail@gmail.com");        // Gmail address that SENDS the alert
define("SMTP_PASSWORD", "your-16-char-app-password");  // Gmail App Password
define("SMTP_FROM_NAME", "Riyan Portfolio Website");
define("NOTIFY_TO_EMAIL", "youremail@gmail.com");      // where YOU receive new-message alerts

// Sends a notification email. Returns true/false — callers should
// treat a failed email as non-fatal (the message is already saved in
// the database either way).
function sendNotificationEmail($subjectLine, $htmlBody)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        $mail->setFrom(SMTP_USERNAME, SMTP_FROM_NAME);
        $mail->addAddress(NOTIFY_TO_EMAIL);

        $mail->isHTML(true);
        $mail->Subject = $subjectLine;
        $mail->Body = $htmlBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        return false;
    }
}
?>