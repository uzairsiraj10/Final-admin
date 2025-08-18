-- Insert admin user with bcrypt hashed password
-- The password is 'Admin@123' and should be hashed with bcrypt

INSERT INTO users (email, password_hash, name, role)
VALUES (
    'admin@example.com',
    '$2a$10$JUTzPtHslU.rdQmxx67Pb.WDQbLcGApt2GsoTsnfXtK0CBBtvSoIu',  -- bcrypt hash for 'Admin@123'
    'Admin User',
    'admin'
)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role = VALUES(role); 