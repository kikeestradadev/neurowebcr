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

function logTrackContactError(string $message): void
{
    $projectRoot = dirname(__DIR__, 2);
    writeAppLog($projectRoot, 'mysql_errors.log', '[track_contact] ' . $message);
}

function logTrackContactRequest(string $message): void
{
    $projectRoot = dirname(__DIR__, 2);
    writeAppLog($projectRoot, 'track_contact_requests.log', '[track_contact] ' . $message);
}

logTrackContactRequest('Incoming request method=' . ($_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN') . ' uri=' . ($_SERVER['REQUEST_URI'] ?? ''));

$rawInput = file_get_contents('php://input');
if ($rawInput === false || $rawInput === '') {
    logTrackContactError('Empty body received');
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Empty body']);
    exit;
}

$payload = json_decode($rawInput, true);
if (!is_array($payload)) {
    logTrackContactError('Invalid JSON payload: ' . $rawInput);
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid JSON']);
    exit;
}

$leadType = (string)($payload['lead_type'] ?? '');
$ctaText = trim((string)($payload['cta_text'] ?? ''));
$linkUrl = trim((string)($payload['link_url'] ?? ''));
$pageLang = trim((string)($payload['page_lang'] ?? ''));
$pagePath = trim((string)($payload['page_path'] ?? ''));
$referrer = trim((string)($payload['referrer_url'] ?? ''));

if (!in_array($leadType, ['whatsapp', 'email'], true)) {
    logTrackContactError('Invalid lead_type: ' . $leadType);
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Invalid lead_type']);
    exit;
}

if ($ctaText === '' || $linkUrl === '' || $pageLang === '' || $pagePath === '') {
    logTrackContactError('Missing required fields in payload: ' . json_encode($payload));
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Missing required fields']);
    exit;
}

$ctaText = mb_substr($ctaText, 0, 120);
$linkUrl = mb_substr($linkUrl, 0, 2048);
$pageLang = mb_substr($pageLang, 0, 10);
$pagePath = mb_substr($pagePath, 0, 255);
$referrer = mb_substr($referrer, 0, 2048);

$userAgent = mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 512);
$ipAddress = mb_substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64);

try {
    $pdo = getDatabaseConnection();
    $createdAt = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare(
        'INSERT INTO contact_click_events '
        . '(lead_type, cta_text, link_url, page_lang, page_path, referrer_url, user_agent, ip_address, created_at) '
        . 'VALUES (:lead_type, :cta_text, :link_url, :page_lang, :page_path, :referrer_url, :user_agent, :ip_address, :created_at)'
    );

    $stmt->execute([
        'lead_type' => $leadType,
        'cta_text' => $ctaText,
        'link_url' => $linkUrl,
        'page_lang' => $pageLang,
        'page_path' => $pagePath,
        'referrer_url' => $referrer !== '' ? $referrer : null,
        'user_agent' => $userAgent !== '' ? $userAgent : null,
        'ip_address' => $ipAddress !== '' ? $ipAddress : null,
        'created_at' => $createdAt,
    ]);

    echo json_encode(['ok' => true]);
    logTrackContactRequest('Insert OK lead_type=' . $leadType . ' page_path=' . $pagePath);
} catch (Throwable $e) {
    logTrackContactError('Insert failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'DB error']);
}
