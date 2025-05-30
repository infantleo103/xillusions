import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/products';

export async function GET(request, { params }) {
  try {
    const category = params.category;
    
    // Get limit from query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    
    const products = await getProductsByCategory(category, limit);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products by category' },
      { status: 500 }
    );
  }
}