import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/users';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.mobile || !body.password) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Create the user
    const result = await createUser(body);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        user: result.user
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}