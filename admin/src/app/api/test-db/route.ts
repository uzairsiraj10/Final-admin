import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { hashPassword, verifyPassword } from '../../../lib/auth';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      // Get all users (only id and email for security)
      const [users] = await connection.execute(
        'SELECT id, email FROM users'
      );
      
      return NextResponse.json({ users });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        message: 'Database connection failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Generate a new hash
    const newHash = await hashPassword(password);
    
    // Verify the password against the new hash
    const isValidNew = await verifyPassword(password, newHash);
    
    // Verify against our stored hash
    const storedHash = '$2a$12$k8P.Fv8hNjVNxKxuKUQIwOd7YYKsGqRwNXz8RALIBBxPgXR7pYa.y';
    const isValidStored = await verifyPassword(password, storedHash);
    
    return NextResponse.json({
      newHash,
      isValidNew,
      storedHash,
      isValidStored,
      passwordLength: password.length,
      newHashLength: newHash.length,
      storedHashLength: storedHash.length
    });
  } catch (error: any) {
    console.error('Hash test error:', error);
    return NextResponse.json(
      { 
        message: 'Hash test failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
} 