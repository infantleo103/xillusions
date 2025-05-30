import { NextResponse } from 'next/server';
import { getAllDocuments } from '@/lib/db';

export async function GET() {
  try {
    // Replace 'users' with any collection name you have in your database
    const data = await getAllDocuments('users');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from database' },
      { status: 500 }
    );
  }
}