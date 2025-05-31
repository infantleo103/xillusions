'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'general',
    productFor: 'all',
    stock: 0,
    costPrice: 0
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: ['price', 'stock', 'costPrice'].includes(name) ? parseFloat(value) || '' : value
    }));
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!newProduct.name.trim()) {
      setError('Product name is required');
      return;
    }
    
    if (!newProduct.price || isNaN(newProduct.price) || parseFloat(newProduct.price) <= 0) {
      setError('Valid price is required');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price)
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new product to the list
        setProducts(prev => [...prev, result.data]);
        
        // Reset the form
        setNewProduct({
          name: '',
          description: '',
          price: '',
          image: '',
          category: 'general',
          productFor: 'all',
          stock: 0,
          costPrice: 0
        });
        
        // Clear any previous errors
        setError(null);
        
        // Show success message
        setSuccess('Product added successfully!');
        setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
      } else {
        setError(result.error || 'Failed to add product');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Add product error:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the product from the list
        setProducts(prev => prev.filter(product => product._id !== id));
        
        // Clear any previous errors
        setError(null);
        
        // Show success message
        setSuccess('Product deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Delete product error:', err);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Fill in the details to add a new product</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="general">General</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                  <option value="toys">Toys</option>
                  <option value="beauty">Beauty</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productFor">Product For</Label>
                <select
                  id="productFor"
                  name="productFor"
                  value={newProduct.productFor}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="customization">Customization</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.costPrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <Button type="submit">Add Product</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>Manage your products</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p>No products found. Add your first product above.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="font-bold">${product.price}</span>
                          {product.category && (
                            <span className="text-blue-600">Category: {product.category}</span>
                          )}
                          {product.stock !== undefined && (
                            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                              Stock: {product.stock}
                            </span>
                          )}
                          <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}