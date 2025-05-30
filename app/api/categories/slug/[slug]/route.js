import { NextResponse } from 'next/server';
import { getCategoryBySlug } from '@/lib/db/categories';

/**
 * GET /api/categories/slug/[slug]
 * Get a category by its slug
 */
export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    
    const category = await getCategoryBySlug(slug);
    
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