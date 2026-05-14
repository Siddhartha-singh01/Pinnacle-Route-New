<?php
declare(strict_types=1);

// Pinnacle Route contact form handler for Hostinger Web Hosting.
// Requires PHP with OpenSSL enabled and outbound SMTP access.
// If info@pinnacleroute.com is a Hostinger Email mailbox, use:
// const SMTP_HOST = 'smtp.hostinger.com';
// const SMTP_PORT = 465;

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465;
const SMTP_USERNAME = 'info@pinnacleroute.com';
const SMTP_PASSWORD = 'Legender@2029';
const MAIL_TO = 'info@pinnacleroute.com';
const MAIL_FROM_NAME = 'Pinnacle Route';

function clean_value(string $value): string {
    return trim(str_replace(["\r", "\0"], '', $value));
}

function field(string $key): string {
    return isset($_POST[$key]) ? clean_value((string) $_POST[$key]) : '';
}

function wants_json(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requestedWith = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return stripos($accept, 'application/json') !== false || strtolower($requestedWith) === 'xmlhttprequest';
}

function respond_json(bool $ok, string $message, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

function fail(string $message, int $code = 400): void {
    if (wants_json()) {
        respond_json(false, $message, $code);
    }
    http_response_code($code);
    echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<title>Submission Error — Pinnacle Route</title>';
    echo '<style>body{margin:0;background:#0D0D0D;color:#F5F5F0;font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;padding:24px}.box{max-width:620px;background:#1C1C1C;border:1px solid rgba(198,169,114,.22);border-radius:12px;padding:32px}a{color:#C6A972}</style>';
    echo '</head><body><div class="box"><h1>Submission could not be sent</h1><p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p><p><a href="index.html#contact">Return to contact form</a></p></div></body></html>';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('This endpoint only accepts form submissions.', 405);
}

if (field('website_confirm') !== '') {
    fail('Spam protection triggered.');
}

$name = field('name');
$company = field('company');
$email = field('email');
$phone = field('phone_whatsapp');
$website = field('website');
$projectType = field('project_type');
$budget = field('budget_range');
$timeline = field('timeline');
$challenge = field('main_business_challenge');

if ($name === '' || $company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $projectType === '' || strlen($challenge) < 10) {
    fail('Please complete all required fields with valid information.');
}

if ($website !== '' && !filter_var($website, FILTER_VALIDATE_URL)) {
    fail('Please enter a valid website URL.');
}

$subject = 'New Pinnacle Route Strategy Session Inquiry';
$bodyLines = [
    'New strategy session inquiry from the Pinnacle Route website.',
    '',
    'Full Name: ' . $name,
    'Company / Business: ' . $company,
    'Email: ' . $email,
    'Phone / WhatsApp: ' . ($phone ?: 'Not provided'),
    'Website: ' . ($website ?: 'Not provided'),
    'Project Type: ' . $projectType,
    'Budget Range: ' . ($budget ?: 'Not provided'),
    'Timeline: ' . ($timeline ?: 'Not provided'),
    '',
    'Main Business Challenge:',
    $challenge,
    '',
    'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC',
];
$body = implode("\r\n", $bodyLines);

function smtp_read($socket): string {
    $data = '';
    while (($line = fgets($socket, 515)) !== false) {
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtp_cmd($socket, string $command, array $expected): string {
    fwrite($socket, $command . "\r\n");
    $response = smtp_read($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $expected, true)) {
        throw new RuntimeException('SMTP command failed: ' . $response);
    }
    return $response;
}

function smtp_send(string $to, string $replyTo, string $subject, string $body): void {
    $socket = stream_socket_client('ssl://' . SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
    if (!$socket) {
        throw new RuntimeException('Could not connect to SMTP server: ' . $errstr);
    }
    stream_set_timeout($socket, 20);

    $greeting = smtp_read($socket);
    if ((int) substr($greeting, 0, 3) !== 220) {
        throw new RuntimeException('SMTP greeting failed: ' . $greeting);
    }

    smtp_cmd($socket, 'EHLO pinnacleroute.com', [250]);
    smtp_cmd($socket, 'AUTH LOGIN', [334]);
    smtp_cmd($socket, base64_encode(SMTP_USERNAME), [334]);
    smtp_cmd($socket, base64_encode(SMTP_PASSWORD), [235]);
    smtp_cmd($socket, 'MAIL FROM:<' . SMTP_USERNAME . '>', [250]);
    smtp_cmd($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
    smtp_cmd($socket, 'DATA', [354]);

    $headers = [
        'From: ' . MAIL_FROM_NAME . ' <' . SMTP_USERNAME . '>',
        'To: ' . $to,
        'Reply-To: ' . $replyTo,
        'Subject: ' . $subject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $message = preg_replace('/^\./m', '..', $message);
    fwrite($socket, $message . "\r\n.\r\n");
    $response = smtp_read($socket);
    if ((int) substr($response, 0, 3) !== 250) {
        throw new RuntimeException('SMTP message was not accepted: ' . $response);
    }
    smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);
}

try {
    smtp_send(MAIL_TO, $email, $subject, $body);
} catch (Throwable $e) {
    error_log('Pinnacle Route contact form error: ' . $e->getMessage());
    fail('We could not send the inquiry right now. Please email info@pinnacleroute.com or message us on WhatsApp.', 500);
}

if (wants_json()) {
    respond_json(true, 'Your inquiry has been sent successfully.');
}

$redirect = field('redirect_success') ?: 'index.html?submitted=true#contact';
header('Location: ' . $redirect, true, 303);
exit;
