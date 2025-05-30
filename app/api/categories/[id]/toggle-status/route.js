import { NextResponse } from 'next/server';
import { toggleCategoryStatus } from '@/lib/db/categories';

/**
 * POST /api/categories/[id]/toggle-status
 * Toggle a category's status between active and inactive
 */
export async function POST(request, { params }) {
  try {
    const id = params.id;
    
    const result = await toggleCategoryStatus(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category status updated successfully',
      status: result.status
    });
  } catch (error) {
    console.error('Database error:', error);
    
    if (error.message === 'Category not found') {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update category status' },
      { status: 500 }
    );
  }
}