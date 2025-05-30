import { NextResponse } from 'next/server';
import { getCategory, updateCategory, deleteCategory } from '@/lib/db/categories';

/**
 * GET /api/categories/[id]
 * Get a specific category by ID
 */
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    const category = await getCategory(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 * Update a category
 */
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Check if category exists
    const existingCategory = await getCategory(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const result = await updateCategory(id, body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Database error:', error);
    
    // Handle specific errors
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category
 */
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    // Check if category exists
    const existingCategory = await getCategory(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    await deleteCategory(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}