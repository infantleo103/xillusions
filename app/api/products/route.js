import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db/products';

// Get all products with optional filtering
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const productFor = searchParams.get('productFor') || 'all';
    const inStock = searchParams.get('inStock') !== null 
      ? searchParams.get('inStock') === 'true' 
      : undefined;
    
    // Build filters object
    const filters = {
      search,
      category,
      productFor,
      inStock
    };
    
    const products = await getProducts(filters);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request body here
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }
    
    // Set default values for required fields
    const productData = {
      ...body,
      inStock: body.inStock !== undefined ? body.inStock : true,
      featured: body.featured !== undefined ? body.featured : false,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      stock: body.stock || 0
    };
    
    const product = await createProduct(productData);
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      data: product
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}