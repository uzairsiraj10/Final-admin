-- Update admin password to simple password: admin123
UPDATE users 
SET password = 'admin123'
WHERE email = 'admin@example.com'; 