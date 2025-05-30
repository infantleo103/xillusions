import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/users';

// Get all users
export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    try {
      const user = await createUser(body);
      return NextResponse.json({ 
        success: true, 
        message: 'User created successfully',
        data: user
      }, { status: 201 });
    } catch (err) {
      if (err.message === 'User with this email already exists') {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}