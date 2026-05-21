<?php

declare(strict_types=1);

function getDatabaseConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $hosts = ['localhost', '127.0.0.1'];
    $dbName = 'neurowebcr';
    $user = 'root';
    $password = '';
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $lastException = null;
    foreach ($hosts as $host) {
        try {
            $pdo = new PDO(
                "mysql:host={$host};dbname={$dbName};charset=utf8mb4",
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
