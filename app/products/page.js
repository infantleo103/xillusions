import { getAllDocuments } from '@/lib/db';

async function getProducts() {
  try {
    const products = await getAllDocuments('products');
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id.toString()} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-lg font-bold mt-2">${product.price}</p>
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover mt-4 rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}