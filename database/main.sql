CREATE DATABASE JPI-APP;
USE JPI-APP;

-- ตารางบทความ
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thumbnail VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ตารางบริการ
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางผลงาน
CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thumbnail VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางบุคลากร
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_image VARCHAR(255),
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    link_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางผู้ดูแลระบบ
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password, email) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin@jaipongz.com');