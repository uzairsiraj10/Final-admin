# Database Connection Troubleshooting Guide

## Current Issue: ETIMEDOUT Error

The application is getting a connection timeout error when trying to connect to the MySQL database.

### Database Configuration
- **Host**: 198.38.90.50
- **Port**: 3306
- **Database**: bolalooc_mazdoor
- **Username**: bolalooc_maz123
- **Password**: EsbER0JeytIXlp40

### Network Status
✅ **Ping Test**: Server is reachable (ping successful)
❌ **MySQL Connection**: Connection times out

## Troubleshooting Steps

### 1. Verify Database Server Status
- Check if MySQL service is running on the server
- Verify MySQL is listening on port 3306
- Check MySQL error logs for any issues

### 2. Check MySQL Configuration
The MySQL server might not be configured to accept remote connections. Check:

```sql
-- On the MySQL server, check if remote connections are allowed
SELECT user, host FROM mysql.user WHERE user = 'bolalooc_maz123';

-- If the host is 'localhost' only, you need to allow remote connections
GRANT ALL PRIVILEGES ON bolalooc_mazdoor.* TO 'bolalooc_maz123'@'%' IDENTIFIED BY 'EsbER0JeytIXlp40';
FLUSH PRIVILEGES;
```

### 3. Check Firewall Settings
- Ensure port 3306 is open on the server firewall
- Check if any network firewall is blocking the connection
- Verify the server allows connections from your IP address

### 4. Test Connection with Different Tools
Try connecting with MySQL command line client:
```bash
mysql -h 198.38.90.50 -P 3306 -u bolalooc_maz123 -p bolalooc_mazdoor
```

### 5. Alternative Connection Methods
If the issue persists, try:
- Using a different port (if MySQL is configured on a different port)
- Connecting through SSH tunnel
- Using a different database hosting service

## Password Hashing Issue

The application uses bcrypt for password hashing, but you were using SHA2 in your SQL insert.

### Correct Password Setup
Use the provided scripts to create the admin user with proper bcrypt hashing:

1. **Test connection first**: `node test_connection.js`
2. **Create admin user**: `node create_admin.js`
3. **Login credentials**: 
   - Email: admin@example.com
   - Password: Admin@123

### Manual SQL Insert (if needed)
If you need to manually insert the user, use this bcrypt hash for 'Admin@123':
```sql
INSERT INTO users (email, password_hash, name, role)
VALUES (
    'admin@example.com',
    '$2b$10$YourGeneratedBcryptHashHere',
    'Admin User',
    'admin'
);
```

## Next Steps
1. Contact your database administrator to verify the server configuration
2. Check if the database server allows remote connections
3. Verify the credentials are correct
4. Test the connection with the provided scripts 