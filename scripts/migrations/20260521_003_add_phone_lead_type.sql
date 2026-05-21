ALTER TABLE contact_click_events
    MODIFY lead_type ENUM('whatsapp', 'email', 'phone') NOT NULL;

ALTER TABLE lead_submissions
    MODIFY lead_type ENUM('whatsapp', 'email', 'phone') NOT NULL;
