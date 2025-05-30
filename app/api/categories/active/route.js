import { NextResponse } from 'next/server';
import { getActiveCategories } from '@/lib/db/categories';

/**
 * GET /api/categories/active
 * Get all active categories
 */
export async function GET(request) {
  try {
    const categories = await getActiveCategories();
    
    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active categories' },
      { status: 500 }
    );
  }
}