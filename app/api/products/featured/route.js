import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/products';

/**
 * API endpoint to get featured products
 * 
 * @returns {Promise<NextResponse>} JSON response with featured products
 */
export async function GET(request) {
  try {
    // Get the search params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    const productFor = searchParams.get('productFor') || 'all';
    
    // Build query filters
    const filters = {};
    
    // Add featured filter
    filters.featured = true;
    
    // Add productFor filter if specified
    if (productFor !== 'all') {
      filters.productFor = productFor;
    }
    
    // Fetch products from database
    const products = await getProducts(filters);
    
    // Limit the number of products returned
    const limitedProducts = products.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      data: limitedProducts
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}