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

$projectRoot = dirname(__DIR__);
loadEnvFile($projectRoot);

$primaryHost = envValue('DB_HOST', 'localhost');
$fallbackHost = envValue('DB_HOST_FALLBACK', '127.0.0.1');
$port = envValue('DB_PORT', '3306');
$dbName = envValue('DB_NAME', 'neurowebcr');
$user = envValue('DB_USER', 'root');
$password = envValue('DB_PASSWORD', '');
$charset = envValue('DB_CHARSET', 'utf8mb4');

$hosts = array_values(array_unique(array_filter([$primaryHost, $fallbackHost])));
$migrationsDir = __DIR__ . '/migrations';

if (!is_dir($migrationsDir)) {
    fwrite(STDERR, "No existe el directorio de migraciones: {$migrationsDir}\n");
    exit(1);
}

try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $serverPdo = null;
    $lastException = null;
    foreach ($hosts as $host) {
        try {
            $serverPdo = new PDO(
                "mysql:host={$host};port={$port};charset={$charset}",
                $user,
                $password,
                $options
            );
            break;
        } catch (PDOException $e) {
            $lastException = $e;
        }
    }

    if (!$serverPdo instanceof PDO) {
        throw $lastException ?? new RuntimeException('No se pudo conectar al servidor MySQL.');
    }

    $serverPdo->exec(
        "CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );

    $pdo = null;
    foreach ($hosts as $host) {
        try {
            $pdo = new PDO(
                "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}",
                $user,
                $password,
                $options
            );
            break;
        } catch (PDOException $e) {
            $lastException = $e;
        }
    }

    if (!$pdo instanceof PDO) {
        throw $lastException ?? new RuntimeException('No se pudo conectar a la base de datos.');
    }
} catch (Throwable $e) {
    fwrite(STDERR, "Error de conexión MySQL: " . $e->getMessage() . "\n");
    exit(1);
}

$pdo->exec(
    'CREATE TABLE IF NOT EXISTS migrations (' .
    'id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,' .
    'migration_name VARCHAR(255) NOT NULL UNIQUE,' .
    'executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP' .
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
);

$files = glob($migrationsDir . '/*.sql');
sort($files);

if (!$files) {
    echo "No hay migraciones para ejecutar.\n";
    exit(0);
}

$checkStmt = $pdo->prepare('SELECT 1 FROM migrations WHERE migration_name = :name LIMIT 1');
$insertStmt = $pdo->prepare('INSERT INTO migrations (migration_name) VALUES (:name)');

foreach ($files as $file) {
    $name = basename($file);

    $checkStmt->execute(['name' => $name]);
    if ($checkStmt->fetchColumn()) {
        echo "- Omitida (ya aplicada): {$name}\n";
        continue;
    }

    $sql = file_get_contents($file);
    if ($sql === false) {
        fwrite(STDERR, "No se pudo leer la migración: {$name}\n");
        exit(1);
    }

    try {
        $pdo->exec($sql);
        $insertStmt->execute(['name' => $name]);
        echo "+ Aplicada: {$name}\n";
    } catch (Throwable $e) {
        fwrite(STDERR, "Error aplicando {$name}: " . $e->getMessage() . "\n");
        exit(1);
    }
}

echo "Migraciones completadas.\n";
