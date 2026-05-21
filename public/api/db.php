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
            return $pdo;
        } catch (PDOException $e) {
            $lastException = $e;
        }
    }

    throw $lastException ?? new RuntimeException('No se pudo conectar a MySQL.');
}
