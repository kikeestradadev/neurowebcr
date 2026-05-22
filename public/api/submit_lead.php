<?php

declare(strict_types=1);

date_default_timezone_set('America/Costa_Rica');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/db.php';

function leadError(string $message, int $status = 422): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'message' => $message]);
    exit;
}

$rawInput = file_get_contents('php://input');
if ($rawInput === false || $rawInput === '') {
    leadError('Empty body', 400);
}

$payload = json_decode($rawInput, true);
if (!is_array($payload)) {
    leadError('Invalid JSON', 400);
}

$leadType = trim((string)($payload['lead_type'] ?? ''));
$fullName = trim((string)($payload['full_name'] ?? ''));
$whatsappNumber = trim((string)($payload['whatsapp_number'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));
$serviceInterest = trim((string)($payload['service_interest'] ?? ''));
$pageLang = trim((string)($payload['page_lang'] ?? ''));
$pagePath = trim((string)($payload['page_path'] ?? ''));

if (!in_array($leadType, ['whatsapp', 'email', 'phone'], true)) {
    leadError('Invalid lead_type');
}

if ($fullName === '' || $pageLang === '' || $pagePath === '') {
    leadError('Missing required fields');
}

if ($serviceInterest === '') {
    leadError('Service interest is required');
}

if ($leadType === 'whatsapp' && $whatsappNumber === '') {
    leadError('WhatsApp number is required');
}

if ($leadType === 'email') {
    if ($phone === '' || $email === '') {
        leadError('Phone and email are required');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        leadError('Invalid email');
    }
}

if ($leadType === 'phone' && $phone === '') {
    leadError('Phone is required');
}

$fullName = mb_substr($fullName, 0, 140);
$whatsappNumber = mb_substr($whatsappNumber, 0, 40);
$phone = mb_substr($phone, 0, 40);
$email = mb_substr($email, 0, 180);
$message = mb_substr($message, 0, 3000);
$serviceInterest = mb_substr($serviceInterest, 0, 140);
$pageLang = mb_substr($pageLang, 0, 10);
$pagePath = mb_substr($pagePath, 0, 255);
$userAgent = mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 512);
$ipAddress = mb_substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64);
$createdAt = date('Y-m-d H:i:s');

try {
    $pdo = getDatabaseConnection();
    $table = trim((string)$pdo->query('SELECT DATABASE()')->fetchColumn());
    $hasServiceInterestColumn = false;

    if ($table !== '') {
        $checkColumn = $pdo->prepare(
            'SELECT 1 FROM information_schema.COLUMNS '
            . 'WHERE TABLE_SCHEMA = :schema AND TABLE_NAME = :table AND COLUMN_NAME = :column LIMIT 1'
        );
        $checkColumn->execute([
            'schema' => $table,
            'table' => 'lead_submissions',
            'column' => 'service_interest',
        ]);
        $hasServiceInterestColumn = (bool)$checkColumn->fetchColumn();
    }

    $finalMessage = $message !== '' ? $message : 'Solicitud de llamada';
    if (!$hasServiceInterestColumn) {
        $finalMessage = '[Servicio de interés: ' . $serviceInterest . "]\n" . $finalMessage;
    }

    if ($hasServiceInterestColumn) {
        $stmt = $pdo->prepare(
            'INSERT INTO lead_submissions '
            . '(lead_type, full_name, service_interest, whatsapp_number, phone, email, message, page_lang, page_path, ip_address, user_agent, created_at) '
            . 'VALUES (:lead_type, :full_name, :service_interest, :whatsapp_number, :phone, :email, :message, :page_lang, :page_path, :ip_address, :user_agent, :created_at)'
        );

        $stmt->execute([
            'lead_type' => $leadType,
            'full_name' => $fullName,
            'service_interest' => $serviceInterest,
            'whatsapp_number' => $leadType === 'whatsapp' ? $whatsappNumber : null,
            'phone' => in_array($leadType, ['email', 'phone'], true) ? $phone : null,
            'email' => $leadType === 'email' ? $email : null,
            'message' => $finalMessage,
            'page_lang' => $pageLang,
            'page_path' => $pagePath,
            'ip_address' => $ipAddress !== '' ? $ipAddress : null,
            'user_agent' => $userAgent !== '' ? $userAgent : null,
            'created_at' => $createdAt,
        ]);
    } else {
        $stmt = $pdo->prepare(
            'INSERT INTO lead_submissions '
            . '(lead_type, full_name, whatsapp_number, phone, email, message, page_lang, page_path, ip_address, user_agent, created_at) '
            . 'VALUES (:lead_type, :full_name, :whatsapp_number, :phone, :email, :message, :page_lang, :page_path, :ip_address, :user_agent, :created_at)'
        );

        $stmt->execute([
            'lead_type' => $leadType,
            'full_name' => $fullName,
            'whatsapp_number' => $leadType === 'whatsapp' ? $whatsappNumber : null,
            'phone' => in_array($leadType, ['email', 'phone'], true) ? $phone : null,
            'email' => $leadType === 'email' ? $email : null,
            'message' => $finalMessage,
            'page_lang' => $pageLang,
            'page_path' => $pagePath,
            'ip_address' => $ipAddress !== '' ? $ipAddress : null,
            'user_agent' => $userAgent !== '' ? $userAgent : null,
            'created_at' => $createdAt,
        ]);
    }

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    $projectRoot = dirname(__DIR__, 2);
    writeAppLog($projectRoot, 'mysql_errors.log', '[submit_lead] Insert failed: ' . $e->getMessage());
    leadError('DB error', 500);
}
