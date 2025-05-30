import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/users';
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

export async function POST(request) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin(request);
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.password || !body.role) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Create the user
    const result = await createUser({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      mobile: body.mobile || '',
      role: body.role
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: result.user
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}