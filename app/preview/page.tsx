"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  ShoppingBag,
  Users,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Settings,
  Database,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"

// Mock data for preview
const mockProducts = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=400&width=300&query=premium cotton t-shirt",
    badge: "Best Seller",
    category: "men",
  },
  {
    id: 2,
    name: "Designer Denim Jacket",
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=400&width=300&query=designer denim jacket",
    badge: "New",
    category: "women",
  },
  {
    id: 3,
    name: "Custom Embroidered Hoodie",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=400&width=300&query=custom embroidered hoodie",
    badge: "Customizable",
    category: "custom",
  },
]

const mockCartItems = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 49.99,
    image: "/placeholder.svg?height=100&width=100&query=premium cotton t-shirt",
    quantity: 2,
  },
  {
    id: 2,
    name: "Designer Denim Jacket",
    price: 129.99,
    image: "/placeholder.svg?height=100&width=100&query=designer denim jacket",
    quantity: 1,
  },
]

const mockOrders = [
  {
    orderNumber: "ORD-001234",
    customerInfo: { firstName: "John", lastName: "Doe", email: "john@example.com" },
    total: 229.97,
    status: "delivered",
    createdAt: new Date(),
  },
  {
    orderNumber: "ORD-001235",
    customerInfo: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
    total: 159.99,
    status: "shipped",
    createdAt: new Date(),
  },
]

const mockUsers = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    createdAt: new Date(),
  },
  {
    _id: "2",
    firstName: "Admin",
    lastName: "User",
    email: "admin@store.com",
    role: "admin",
    status: "active",
    createdAt: new Date(),
  },
]

export default function UIPreviewPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto"
      case "tablet":
        return "max-w-2xl mx-auto"
      default:
        return "w-full"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">E-Commerce UI Preview</h1>
          <p className="text-muted-foreground text-lg">
            Complete overview of all components and pages in the e-commerce system
          </p>

          {/* Viewport Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant={viewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={viewMode === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="h-4 w-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </Button>
          </div>
        </div>

        <Tabs defaultValue="frontend" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="frontend">Frontend Pages</TabsTrigger>
            <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="frontend" className="space-y-8">
            {/* Homepage Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Homepage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden ${getViewportClass()}`}>
                  {/* Header */}
                  <div className="bg-white border-b p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">STORE</h2>
                      <div className="flex items-center gap-4">
                        <nav className="hidden md:flex gap-6">
                          <span className="text-sm">New Arrivals</span>
                          <span className="text-sm">Women</span>
                          <span className="text-sm">Men</span>
                          <span className="text-sm">Sale</span>
                        </nav>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <ShoppingBag className="h-4 w-4" />
                          </Button>
                          <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">2</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold">
                          Discover Your
                          <span className="text-primary block">Perfect Style</span>
                        </h1>
                        <p className="text-muted-foreground">
                          Explore our curated collection of premium fashion and accessories.
                        </p>
                        <div className="flex gap-4">
                          <Button>Shop Now</Button>
                          <Button variant="outline">View Collection</Button>
                        </div>
                      </div>
                      <div className="relative">
                        <img
                          src="/placeholder.svg?height=300&width=250&query=fashion model"
                          alt="Fashion model"
                          className="rounded-lg object-cover w-full"
                        />
                        <Badge className="absolute top-4 right-4 bg-red-500">30% OFF</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="p-8 bg-white">
                    <h2 className="text-2xl font-bold text-center mb-6">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Women's Fashion", "Men's Fashion", "New Arrivals", "Customize"].map((category) => (
                        <div key={category} className="relative group cursor-pointer">
                          <img
                            src={`/placeholder.svg?height=200&width=200&query=${category.toLowerCase()}`}
                            alt={category}
                            className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg" />
                          <div className="absolute bottom-2 left-2 text-white font-semibold text-sm">{category}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Products */}
                  <div className="p-8 bg-gray-50">
                    <h2 className="text-2xl font-bold text-center mb-6">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mockProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                          <div className="relative">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                            />
                            <Badge className="absolute top-2 left-2">{product.badge}</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold">${product.price}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">⭐ {product.rating}</span>
                              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Cart Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-white ${getViewportClass()}`}>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        {mockCartItems.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-lg font-bold text-primary">${item.price}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button variant="outline" size="sm">
                                  -
                                </Button>
                                <span className="px-3">{item.quantity}</span>
                                <Button variant="outline" size="sm">
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6">
                          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>$229.97</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>$18.40</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>Total</span>
                              <span>$248.37</span>
                            </div>
                          </div>
                          <Button className="w-full">Proceed to Checkout</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Checkout Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-gray-50 ${getViewportClass()}`}>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Shipping Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">First Name</label>
                                <input className="w-full p-2 border rounded mt-1" placeholder="John" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Last Name</label>
                                <input className="w-full p-2 border rounded mt-1" placeholder="Doe" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <input className="w-full p-2 border rounded mt-1" placeholder="john@example.com" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Address</label>
                              <input className="w-full p-2 border rounded mt-1" placeholder="123 Main St" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Payment Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Card Number</label>
                              <input className="w-full p-2 border rounded mt-1" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Expiry</label>
                                <input className="w-full p-2 border rounded mt-1" placeholder="MM/YY" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">CVV</label>
                                <input className="w-full p-2 border rounded mt-1" placeholder="123" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {mockCartItems.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                              <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>$229.97</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax</span>
                                  <span>$18.40</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total</span>
                                  <span>$248.37</span>
                                </div>
                              </div>
                              <Button className="w-full">Pay $248.37</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Confirmation Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Order Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-white ${getViewportClass()}`}>
                  <div className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your purchase. Your order has been successfully placed.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div>
                          <h3 className="font-semibold mb-2">Order Details</h3>
                          <p className="text-sm text-muted-foreground">Order Number: ORD-123456</p>
                          <p className="text-sm text-muted-foreground">Order Date: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Delivery Information</h3>
                          <p className="text-sm text-muted-foreground">Estimated Delivery: 3-5 business days</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button>Download Receipt</Button>
                      <Button variant="outline">Continue Shopping</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-8">
            {/* Admin Dashboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden ${getViewportClass()}`}>
                  {/* Admin Header */}
                  <div className="bg-white border-b p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Admin Panel</h2>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                          <span className="text-sm">🔔</span>
                          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                            3
                          </Badge>
                        </Button>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-foreground">A</span>
                          </div>
                          <span className="text-sm font-medium">Admin</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-white border-r p-4">
                      <nav className="space-y-2">
                        {[
                          { name: "Dashboard", icon: "📊" },
                          { name: "Users", icon: "👥" },
                          { name: "Products", icon: "📦" },
                          { name: "Orders", icon: "🛒" },
                          { name: "Database", icon: "🗄️" },
                        ].map((item) => (
                          <div key={item.name} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
                            <span>{item.icon}</span>
                            <span className="text-sm">{item.name}</span>
                          </div>
                        ))}
                      </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 bg-gray-50">
                      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                          { title: "Total Users", value: "1,234", icon: "👥", color: "text-blue-600" },
                          { title: "Total Orders", value: "567", icon: "🛒", color: "text-green-600" },
                          { title: "Revenue", value: "$12,345", icon: "💰", color: "text-yellow-600" },
                          { title: "Products", value: "89", icon: "📦", color: "text-purple-600" },
                        ].map((stat) => (
                          <div key={stat.title} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                                <p className="text-xl font-bold">{stat.value}</p>
                              </div>
                              <span className="text-2xl">{stat.icon}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recent Orders */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {mockOrders.map((order) => (
                              <div
                                key={order.orderNumber}
                                className="flex items-center justify-between p-3 border rounded"
                              >
                                <div>
                                  <p className="font-medium">{order.orderNumber}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${order.total.toFixed(2)}</p>
                                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-white ${getViewportClass()}`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold">User Management</h1>
                      <Button>Add User</Button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                      <input className="flex-1 p-2 border rounded" placeholder="Search users..." />
                      <select className="p-2 border rounded">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>User</option>
                      </select>
                    </div>

                    {/* Users Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Role</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockUsers.map((user) => (
                            <tr key={user._id} className="border-t">
                              <td className="p-3">
                                {user.firstName} {user.lastName}
                              </td>
                              <td className="p-3">{user.email}</td>
                              <td className="p-3">
                                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                              </td>
                              <td className="p-3">
                                <Badge variant="default">{user.status}</Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Management Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-white ${getViewportClass()}`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold">Database Management</h1>
                      <Badge variant="outline">MongoDB Atlas</Badge>
                    </div>

                    {/* Database Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Database Connected</p>
                          <p className="text-sm text-muted-foreground">MongoDB Atlas connection successful</p>
                        </div>
                      </div>
                    </div>

                    {/* Database Operations */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Seed Database</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            Populate the database with sample data including products, users, and orders.
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                            <li>• 16 Products (Men's, Women's, New Arrivals, Custom)</li>
                            <li>• 5 Users (including admin user)</li>
                            <li>• 20 Sample Orders with various statuses</li>
                          </ul>
                          <Button className="w-full">Seed Database</Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Clear Database</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            Remove all data from the database. This will delete all products, users, and orders.
                          </p>
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                            <p className="text-sm text-yellow-800">⚠️ This action is irreversible.</p>
                          </div>
                          <Button variant="destructive" className="w-full">
                            Clear All Data
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Feature Summary */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Complete E-Commerce System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">🛍️ Frontend Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Responsive homepage with hero section</li>
                  <li>• Product categories and filtering</li>
                  <li>• Shopping cart with quantity management</li>
                  <li>• Secure checkout process</li>
                  <li>• Order confirmation and tracking</li>
                  <li>• Customizable product options</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">⚙️ Admin Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Comprehensive dashboard with analytics</li>
                  <li>• User management and role control</li>
                  <li>• Product inventory management</li>
                  <li>• Order processing and status updates</li>
                  <li>• Database management tools</li>
                  <li>• Real-time statistics and charts</li>
                  <li>• Secure authentication system</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">🔧 Technical Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• MongoDB Atlas database integration</li>
                  <li>• JWT-based authentication</li>
                  <li>• Server-side API routes</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Responsive UI with Tailwind CSS</li>
                  <li>• Context-based state management</li>
                  <li>• Sample data seeding system</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
