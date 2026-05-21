CREATE TABLE IF NOT EXISTS contact_click_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lead_type ENUM('whatsapp', 'email') NOT NULL,
    cta_text VARCHAR(120) NOT NULL,
    link_url VARCHAR(2048) NOT NULL,
    page_lang VARCHAR(10) NOT NULL,
    page_path VARCHAR(255) NOT NULL,
    referrer_url VARCHAR(2048) NULL,
    user_agent VARCHAR(512) NULL,
    ip_address VARCHAR(64) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_click_created_at (created_at),
    INDEX idx_contact_click_lead_type (lead_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
