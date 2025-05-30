import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db/users';
import jwt from 'jsonwebtoken';

// JWT secret key - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if user is admin
async function isAdmin(request) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function GET(request) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin(request);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get all users
    const users = await getAllUsers();
    
    return NextResponse.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}