-- FaceRec Events Database Schema
-- MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS facerec_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE facerec_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Face embeddings table
CREATE TABLE face_embeddings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    embedding JSON NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event types table
CREATE TABLE event_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type_id INT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    location VARCHAR(255) NULL,
    event_date DATETIME NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_type_id (event_type_id),
    INDEX idx_event_date (event_date),
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Photos table
CREATE TABLE photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NULL,
    mime_type VARCHAR(50) NULL,
    capture_date DATETIME NULL,
    camera_model VARCHAR(100) NULL,
    lens_model VARCHAR(100) NULL,
    iso INT NULL,
    aperture VARCHAR(20) NULL,
    shutter_speed VARCHAR(20) NULL,
    focal_length VARCHAR(20) NULL,
    gps_latitude FLOAT NULL,
    gps_longitude FLOAT NULL,
    photo_type ENUM('landscape', 'portrait', 'group', 'candid', 'other') DEFAULT 'other' NULL,
    face_count INT DEFAULT 0 NOT NULL,
    clarity_score FLOAT NULL,
    sharpness_score FLOAT NULL,
    lighting_score FLOAT NULL,
    blur_score FLOAT NULL,
    overall_quality_score FLOAT NULL,
    face_embeddings JSON NULL,
    detected_faces JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at TIMESTAMP NULL,
    processed BOOLEAN DEFAULT FALSE NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_id (event_id),
    INDEX idx_capture_date (capture_date),
    INDEX idx_camera_model (camera_model),
    INDEX idx_photo_type (photo_type),
    INDEX idx_processed (processed),
    INDEX idx_quality_score (overall_quality_score),
    FULLTEXT INDEX idx_file_name (file_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User events table (registrations)
CREATE TABLE user_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User feedback table
CREATE TABLE user_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    photo_id INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_photo_id (photo_id),
    INDEX idx_is_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default event types
INSERT INTO event_types (name, description) VALUES
('Wedding', 'Wedding ceremonies and receptions'),
('Conference', 'Business conferences and seminars'),
('Party', 'Social gatherings and parties'),
('Concert', 'Music concerts and performances'),
('Sports', 'Sports events and competitions'),
('Graduation', 'Graduation ceremonies'),
('Birthday', 'Birthday celebrations'),
('Corporate', 'Corporate events and meetings'),
('Festival', 'Cultural festivals and celebrations'),
('Other', 'Other types of events');

-- Insert default admin user (password: admin123)
-- You should change this password immediately after first login
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@facerec.com', '$2b$10$LgR7P5lb.0/YHcBjRfqNH.x2S0EWLQpdIKJ.LkQWx.dcJqqzYXSzG', 'Admin', 'User', 'admin', TRUE);
