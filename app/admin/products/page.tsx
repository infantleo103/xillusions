"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define Product type
interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  description: string
  stock: number
  image: string
  frontImage?: string
  backImage?: string
  badge?: string
  productFor: "sale" | "customization"
  rating: number
  reviews: number
  featured: boolean
  customizable: boolean
  inStock: boolean
  sizes: string[]
  colors: string[]
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [productForFilter, setProductForFilter] = useState("all")
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [authChecking, setAuthChecking] = useState(true)

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    stock: "",
    image: "",
    frontImage: "",
    backImage: "",
    badge: "",
    productFor: "sale" as "sale" | "customization",
  })

  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login?redirect=/admin/products')
      } else if (user.role !== 'admin') {
        // Not an admin, redirect to home
        router.push('/')
      } else {
        setAuthChecking(false)
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authChecking) {
      fetchProducts()
    }
  }, [search, categoryFilter, productForFilter, authChecking])

  const fetchProducts = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Build query string
      const queryParams = new URLSearchParams()
      if (search) queryParams.append('search', search)
      if (categoryFilter !== 'all') queryParams.append('category', categoryFilter)
      if (productForFilter !== 'all') queryParams.append('productFor', productForFilter)
      
      // Fetch products from API
      const response = await fetch(`/api/admin/products?${queryParams.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        setError(data.error || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('An error occurred while fetching products')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/toggle-status`, {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update the product in the local state
        setProducts(
          products.map((product) =>
            product.id === productId ? { ...product, inStock: data.inStock, updatedAt: new Date().toISOString() } : product,
          ),
        )
      } else {
        setError(data.error || 'Failed to update product status')
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
      setError('An error occurred while updating product status')
    }
  }

  const handleSubmitProduct = async () => {
    // Validate form
    if (!productForm.name.trim()) {
      setError("Product name is required")
      return
    }
    
    if (!productForm.category) {
      setError("Category is required")
      return
    }
    
    if (!productForm.price || isNaN(Number(productForm.price))) {
      setError("Valid price is required")
      return
    }
    
    setError("")
    setSubmitting(true)
    
    try {
      if (isEditing && selectedProduct) {
        // Update existing product
        const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productForm),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Update the product in the local state
          setProducts(
            products.map((product) =>
              product.id === selectedProduct.id
                ? {
                    ...product,
                    name: productForm.name,
                    category: productForm.category,
                    price: Number.parseFloat(productForm.price),
                    originalPrice: Number.parseFloat(productForm.originalPrice || productForm.price),
                    description: productForm.description,
                    stock: Number.parseInt(productForm.stock || '0'),
                    image: productForm.image,
                    frontImage: productForm.frontImage,
                    backImage: productForm.backImage,
                    badge: productForm.badge,
                    productFor: productForm.productFor,
                    customizable: productForm.productFor === "customization",
                    updatedAt: new Date().toISOString(),
                  }
                : product,
            ),
          )
        } else {
          setError(data.error || 'Failed to update product')
          return
        }
      } else {
        // Create new product
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productForm),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Add the new product to the local state
          setProducts([...products, data.product])
        } else {
          setError(data.error || 'Failed to create product')
          return
        }
      }
      
      // Close dialog and reset form on success
      setShowProductDialog(false)
      resetForm()
      
    } catch (error) {
      console.error('Error saving product:', error)
      setError('An error occurred while saving the product')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    setDeleting(true)
    setError("")
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Remove the product from the local state
        setProducts(products.filter((product) => product.id !== productId))
        setShowDeleteDialog(false)
        setSelectedProduct(null)
      } else {
        setError(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('An error occurred while deleting the product')
    } finally {
      setDeleting(false)
    }
  }

  const resetForm = () => {
    setProductForm({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      description: "",
      stock: "",
      image: "",
      frontImage: "",
      backImage: "",
      badge: "",
      productFor: "sale",
    })
    setSelectedProduct(null)
    setIsEditing(false)
  }

  const openEditDialog = (product: Product) => {
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      description: product.description,
      stock: product.stock.toString(),
      image: product.image,
      frontImage: product.frontImage || "",
      backImage: product.backImage || "",
      badge: product.badge,
      productFor: product.productFor,
    })
    setSelectedProduct(product)
    setIsEditing(true)
    setShowProductDialog(true)
  }

  // Show loading state while checking authentication
  if (authChecking) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button
          onClick={() => {
            resetForm()
            setShowProductDialog(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
                <SelectItem value="custom">Customize</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productForFilter} onValueChange={setProductForFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="customization">For Customization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({products?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading products...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.productFor === "customization" ? "default" : "secondary"}>
                        {product.productFor === "customization" ? "Customization" : "Sale"}
                      </Badge>
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleProductStatus(product.id)}>
                          {product.inStock ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          
          {/* Error message in dialog */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) => setProductForm({ ...productForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="new">New Arrivals</SelectItem>
                  <SelectItem value="custom">Customize</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productFor">Product Type</Label>
              <Select
                value={productForm.productFor}
                onValueChange={(value: "sale" | "customization") =>
                  setProductForm({ ...productForm, productFor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="customization">For Customization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                value={productForm.badge}
                onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="image">Main Image URL</Label>
              <Input
                id="image"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                placeholder="Main product image URL"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="frontImage">Front Image URL</Label>
              <Input
                id="frontImage"
                value={productForm.frontImage}
                onChange={(e) => setProductForm({ ...productForm, frontImage: e.target.value })}
                placeholder="URL for front view of product (for customization)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="backImage">Back Image URL</Label>
              <Input
                id="backImage"
                value={productForm.backImage}
                onChange={(e) => setProductForm({ ...productForm, backImage: e.target.value })}
                placeholder="URL for back view of product (for customization)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitProduct} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Create"} Product</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedProduct && deleteProduct(selectedProduct.id)}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
