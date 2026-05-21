CREATE TABLE IF NOT EXISTS lead_submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lead_type ENUM('whatsapp', 'email') NOT NULL,
    full_name VARCHAR(140) NOT NULL,
    whatsapp_number VARCHAR(40) NULL,
    phone VARCHAR(40) NULL,
    email VARCHAR(180) NULL,
    message TEXT NOT NULL,
    page_lang VARCHAR(10) NOT NULL,
    page_path VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(512) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lead_submissions_type (lead_type),
    INDEX idx_lead_submissions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
