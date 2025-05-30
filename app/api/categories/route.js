import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db/categories';

/**
 * GET /api/categories
 * Get all categories with optional filtering
 */
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    // Build filters object
    const filters = {
      search,
      status
    };
    
    const categories = await getCategories(filters);
    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }
    
    // Set default values for required fields
    const categoryData = {
      ...body,
      status: body.status || 'active'
    };
    
    const category = await createCategory(categoryData);
    return NextResponse.json({ 
      success: true, 
      message: 'Category created successfully',
      data: category
    }, { status: 201 });
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
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}