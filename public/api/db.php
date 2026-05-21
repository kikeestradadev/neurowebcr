<?php

declare(strict_types=1);

function loadEnvFile(string $projectRoot): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }

    $envPath = $projectRoot . '/.env';
    if (!is_file($envPath)) {
        $loaded = true;
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        $loaded = true;
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);

        $existing = getenv($key);
        if ($existing !== false && $existing !== "") {
            $_ENV[$key] = $existing;
            continue;
        }

        $_ENV[$key] = $value;
        putenv("{$key}={$value}");
    }

    $loaded = true;
}

function envValue(string $key, string $default = ''): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    return $value;
}

function normalizeDbTimezoneOffset(string $offset): string
{
    return preg_match('/^[+-](0\d|1[0-4]):[0-5]\d$/', $offset) === 1 ? $offset : '-06:00';
}

function initializeAppTimezone(string $projectRoot): void
{
    loadEnvFile($projectRoot);
    $appTimezone = envValue('APP_TIMEZONE', 'America/Costa_Rica');
    if (!@date_default_timezone_set($appTimezone)) {
        date_default_timezone_set('America/Costa_Rica');
    }
}

function writeAppLog(string $projectRoot, string $filename, string $message): void
{
    $logDir = $projectRoot . '/logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0775, true);
    }

    if (is_dir($logDir) && !is_writable($logDir)) {
        @chmod($logDir, 0777);
    }

    if (!is_dir($logDir) || !is_writable($logDir)) {
        error_log('[neurowebcr-log-fallback] ' . $message);
        return;
    }

    $line = sprintf("[%s] %s\n", date('Y-m-d H:i:s'), $message);
    $logFile = $logDir . '/' . $filename;
    if (is_file($logFile) && !is_writable($logFile)) {
        @chmod($logFile, 0666);
    }

    $result = @file_put_contents($logFile, $line, FILE_APPEND);
    if ($result === false) {
        error_log('[neurowebcr-log-fallback] ' . $message);
    }
}

function getDatabaseConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $projectRoot = dirname(__DIR__, 2);
    loadEnvFile($projectRoot);

    $primaryHost = envValue('DB_HOST', 'localhost');
    $fallbackHost = envValue('DB_HOST_FALLBACK', '127.0.0.1');
    $port = envValue('DB_PORT', '3306');
    $dbName = envValue('DB_NAME', 'neurowebcr');
    $user = envValue('DB_USER', 'root');
    $password = envValue('DB_PASSWORD', '');
    $charset = envValue('DB_CHARSET', 'utf8mb4');
    $dbTimezoneOffset = normalizeDbTimezoneOffset(envValue('DB_TIMEZONE_OFFSET', '-06:00'));

    $hosts = array_values(array_unique(array_filter([$primaryHost, $fallbackHost])));
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $lastException = null;
    foreach ($hosts as $host) {
        try {
            $pdo = new PDO(
                "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}",
                $user,
                $password,
                $options
            );
            $pdo->exec("SET time_zone = '{$dbTimezoneOffset}'");
            return $pdo;
        } catch (PDOException $e) {
            $lastException = $e;
            writeAppLog(
                $projectRoot,
                'mysql_errors.log',
                sprintf('Connection failed on host=%s port=%s db=%s error=%s', $host, $port, $dbName, $e->getMessage())
            );
        }
    }

    throw $lastException ?? new RuntimeException('No se pudo conectar a MySQL.');
}

initializeAppTimezone(dirname(__DIR__, 2));
