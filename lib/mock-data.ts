export interface CustomerInfo {
  name: string
  email: string
  mobile: string
  address: string
}

export interface Item {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
  customization?: {
    size?: string
    color?: string
    design?: any[]
  }
}

export interface Order {
  id: number
  orderNumber: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  subtotal: number
  tax: number
  discount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    mobile: string // Add mobile to order info
    address: string
    city: string
    state: string
    zip: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  frontImage?: string // Add front image URL
  backImage?: string // Add back image URL
  category: string
  description: string
  badge: string
  rating: number
  reviews: number
  featured: boolean
  customizable: boolean
  customOptions?: string[]
  inStock: boolean
  stock: number
  sizes: string[]
  colors: string[]
  productFor: "sale" | "customization" // New field to distinguish product type
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  mobile: string // Add mobile number field
  role: "user" | "admin"
  status: "active" | "blocked"
  createdAt: Date
  updatedAt: Date
}

export interface ProfileOrder {
  id: string
  customerInfo: CustomerInfo
  items: Item[]
  total: number
  status: string
  paymentMethod: string
  date: string
}

const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@xillusions.com",
    firstName: "Admin",
    lastName: "User",
    mobile: "+1234567890",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    mobile: "+1234567891",
    role: "user",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: 3,
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    mobile: "+1234567892",
    role: "user",
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
  {
    id: 4,
    email: "mike.wilson@example.com",
    firstName: "Mike",
    lastName: "Wilson",
    mobile: "+1234567893",
    role: "user",
    status: "blocked",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date(),
  },
]

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=400&width=400&query=white+t-shirt",
    frontImage: "/placeholder.svg?height=400&width=400&query=white+t-shirt+front",
    backImage: "/placeholder.svg?height=400&width=400&query=white+t-shirt+back",
    category: "men",
    description: "Premium cotton classic white t-shirt perfect for everyday wear",
    badge: "Best Seller",
    rating: 4.5,
    reviews: 128,
    featured: true,
    customizable: true,
    customOptions: ["Size", "Color", "Text", "Logo"],
    inStock: true,
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    productFor: "customization",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Vintage Denim Jacket",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=400&query=denim+jacket",
    frontImage: "/placeholder.svg?height=400&width=400&query=denim+jacket+front",
    backImage: "/placeholder.svg?height=400&width=400&query=denim+jacket+back",
    category: "women",
    description: "Stylish vintage denim jacket with a modern twist",
    badge: "Trending",
    rating: 4.7,
    reviews: 89,
    featured: true,
    customizable: false,
    inStock: true,
    stock: 25,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Black", "Light Blue"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Custom Hoodie",
    price: 59.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=400&width=400&query=custom+hoodie",
    frontImage: "/placeholder.svg?height=400&width=400&query=custom+hoodie+front",
    backImage: "/placeholder.svg?height=400&width=400&query=custom+hoodie+back",
    category: "men",
    description: "Comfortable hoodie perfect for customization",
    badge: "Customizable",
    rating: 4.6,
    reviews: 156,
    featured: true,
    customizable: true,
    customOptions: ["Size", "Color", "Logo", "Text", "Graphics"],
    inStock: true,
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy", "Red"],
    productFor: "customization",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Elegant Summer Dress",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=400&query=summer+dress",
    frontImage: "/placeholder.svg?height=400&width=400&query=summer+dress+front",
    backImage: "/placeholder.svg?height=400&width=400&query=summer+dress+back",
    category: "women",
    description: "Light and elegant summer dress for special occasions",
    badge: "New",
    rating: 4.8,
    reviews: 203,
    featured: true,
    customizable: false,
    inStock: true,
    stock: 30,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral", "Solid Blue", "White", "Pink"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: "Premium Leather Wallet",
    price: 49.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=400&width=400&query=leather+wallet",
    frontImage: "/placeholder.svg?height=400&width=400&query=leather+wallet+front",
    backImage: "/placeholder.svg?height=400&width=400&query=leather+wallet+back",
    category: "men",
    description: "Handcrafted leather wallet with multiple compartments",
    badge: "Premium",
    rating: 4.4,
    reviews: 67,
    featured: false,
    customizable: true,
    customOptions: ["Color", "Monogram"],
    inStock: true,
    stock: 35,
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
    productFor: "customization",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: "Silk Designer Scarf",
    price: 39.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=400&width=400&query=silk+scarf",
    frontImage: "/placeholder.svg?height=400&width=400&query=silk+scarf+front",
    backImage: "/placeholder.svg?height=400&width=400&query=silk+scarf+back",
    category: "women",
    description: "Luxurious silk scarf with beautiful patterns",
    badge: "Limited",
    rating: 4.3,
    reviews: 45,
    featured: false,
    customizable: false,
    inStock: true,
    stock: 20,
    sizes: ["One Size"],
    colors: ["Red", "Blue", "Green", "Gold"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    name: "Athletic Running Shoes",
    price: 129.99,
    originalPrice: 159.99,
    image: "/placeholder.svg?height=400&width=400&query=running+shoes",
    frontImage: "/placeholder.svg?height=400&width=400&query=running+shoes+front",
    backImage: "/placeholder.svg?height=400&width=400&query=running+shoes+back",
    category: "new",
    description: "High-performance running shoes for athletes",
    badge: "Sport",
    rating: 4.7,
    reviews: 312,
    featured: true,
    customizable: false,
    inStock: true,
    stock: 45,
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "White", "Blue", "Red"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: "Designer Handbag",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=400&width=400&query=designer+handbag",
    frontImage: "/placeholder.svg?height=400&width=400&query=designer+handbag+front",
    backImage: "/placeholder.svg?height=400&width=400&query=designer+handbag+back",
    category: "women",
    description: "Elegant designer handbag for everyday use",
    badge: "Luxury",
    rating: 4.9,
    reviews: 178,
    featured: true,
    customizable: false,
    inStock: true,
    stock: 15,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Beige"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    name: "Casual Polo Shirt",
    price: 45.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=400&width=400&query=polo+shirt",
    frontImage: "/placeholder.svg?height=400&width=400&query=polo+shirt+front",
    backImage: "/placeholder.svg?height=400&width=400&query=polo+shirt+back",
    category: "men",
    description: "Classic polo shirt for casual and business casual wear",
    badge: "Classic",
    rating: 4.2,
    reviews: 94,
    featured: false,
    customizable: false,
    inStock: true,
    stock: 60,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "White", "Gray", "Green"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 10,
    name: "Bohemian Maxi Dress",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=400&query=maxi+dress",
    frontImage: "/placeholder.svg?height=400&width=400&query=maxi+dress+front",
    backImage: "/placeholder.svg?height=400&width=400&query=maxi+dress+back",
    category: "women",
    description: "Flowing bohemian maxi dress perfect for summer",
    badge: "Boho",
    rating: 4.6,
    reviews: 134,
    featured: false,
    customizable: false,
    inStock: true,
    stock: 25,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral", "Solid", "Paisley"],
    productFor: "sale",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 11,
    name: "Custom Baseball Cap",
    price: 24.99,
    originalPrice: 34.99,
    image: "/placeholder.svg?height=400&width=400&query=baseball+cap",
    frontImage: "/placeholder.svg?height=400&width=400&query=baseball+cap+front",
    backImage: "/placeholder.svg?height=400&width=400&query=baseball+cap+back",
    category: "custom",
    description: "Personalized baseball cap with custom embroidery",
    badge: "Customizable",
    rating: 4.4,
    reviews: 87,
    featured: true,
    customizable: true,
    customOptions: ["Color", "Text", "Logo", "Font"],
    inStock: true,
    stock: 100,
    sizes: ["One Size"],
    colors: ["Black", "White", "Navy", "Red", "Gray"],
    productFor: "customization",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 12,
    name: "Personalized Phone Case",
    price: 19.99,
    originalPrice: 29.99,
    image: "/placeholder.svg?height=400&width=400&query=phone+case",
    frontImage: "/placeholder.svg?height=400&width=400&query=phone+case+front",
    backImage: "/placeholder.svg?height=400&width=400&query=phone+case+back",
    category: "custom",
    description: "Custom phone case with your own design",
    badge: "Popular",
    rating: 4.3,
    reviews: 156,
    featured: true,
    customizable: true,
    customOptions: ["Design", "Color", "Text", "Image"],
    inStock: true,
    stock: 200,
    sizes: ["iPhone", "Samsung", "Google"],
    colors: ["Clear", "Black", "White", "Blue"],
    productFor: "customization",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Men",
    slug: "men",
    description: "Fashion for men",
    image: "https://images.unsplash.com/photo-1648270694882-a89bf37abd37?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Women",
    slug: "women",
    description: "Fashion for women",
    image: "https://res.cloudinary.com/dubljh50p/image/upload/v1746082949/samples/woman-on-a-football-field.jpg",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "New Arrivals",
    slug: "new",
    description: "Latest products",
    image: "https://plus.unsplash.com/premium_photo-1673356302067-aac3b545a362?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Customize",
    slug: "custom",
    description: "Customizable products",
    image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001234",
    items: [
      {
        id: 1,
        name: "Classic White T-Shirt",
        price: 29.99,
        quantity: 2,
        image: "/placeholder.svg?height=400&width=400&query=white+t-shirt",
      },
      {
        id: 3,
        name: "Custom Hoodie",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=400&width=400&query=custom+hoodie",
      },
    ],
    subtotal: 119.97,
    tax: 9.6,
    discount: 0,
    total: 129.57,
    status: "delivered",
    customerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      mobile: "+1234567891",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 2,
    orderNumber: "ORD-001235",
    items: [
      {
        id: 4,
        name: "Elegant Summer Dress",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=400&width=400&query=summer+dress",
      },
    ],
    subtotal: 79.99,
    tax: 6.4,
    discount: 10.0,
    total: 76.39,
    status: "shipped",
    customerInfo: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      mobile: "+1234567892",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-03"),
  },
  {
    id: 3,
    orderNumber: "ORD-001236",
    items: [
      {
        id: 7,
        name: "Athletic Running Shoes",
        price: 129.99,
        quantity: 1,
        image: "/placeholder.svg?height=400&width=400&query=running+shoes",
      },
      {
        id: 11,
        name: "Custom Baseball Cap",
        price: 24.99,
        quantity: 2,
        image: "/placeholder.svg?height=400&width=400&query=baseball+cap",
      },
    ],
    subtotal: 179.97,
    tax: 14.4,
    discount: 0,
    total: 194.37,
    status: "processing",
    customerInfo: {
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.wilson@example.com",
      mobile: "+1234567893",
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
    },
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-12"),
  },
]

export function getProducts(filters?: {
  category?: string
  customizable?: boolean
  featured?: boolean
  search?: string
  productFor?: "sale" | "customization"
}): Product[] {
  let products = [...mockProducts]

  if (filters?.category) {
    products = products.filter((p) => p.category === filters.category)
  }

  if (filters?.customizable !== undefined) {
    products = products.filter((p) => p.customizable === filters.customizable)
  }

  if (filters?.featured !== undefined) {
    products = products.filter((p) => p.featured === filters.featured)
  }

  if (filters?.productFor) {
    products = products.filter((p) => p.productFor === filters.productFor)
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm),
    )
  }

  return products
}

export function getProductById(id: number): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

export function getCategories(): Category[] {
  return [...mockCategories]
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((c) => c.slug === slug)
}

export function getUsers(filters?: {
  role?: "user" | "admin"
  status?: "active" | "blocked"
  search?: string
}): User[] {
  let users = [...mockUsers]

  if (filters?.role) {
    users = users.filter((u) => u.role === filters.role)
  }

  if (filters?.status) {
    users = users.filter((u) => u.status === filters.status)
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    users = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm),
    )
  }

  return users
}

export function getUserById(id: number): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email)
}

export function getOrders(filters?: {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  search?: string
}): Order[] {
  let orders = [...mockOrders]

  if (filters?.status) {
    orders = orders.filter((o) => o.status === filters.status)
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchTerm) ||
        o.customerInfo.firstName.toLowerCase().includes(searchTerm) ||
        o.customerInfo.lastName.toLowerCase().includes(searchTerm) ||
        o.customerInfo.email.toLowerCase().includes(searchTerm),
    )
  }

  return orders
}

export function getOrderById(id: number): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return mockOrders.find((o) => o.orderNumber === orderNumber)
}

export function getDashboardStats() {
  const totalProducts = mockProducts.length
  const totalUsers = mockUsers.length
  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length
  const lowStockProducts = mockProducts.filter((p) => p.stock < 10).length

  return {
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue,
    pendingOrders,
    lowStockProducts,
    recentOrders: mockOrders.slice(0, 5),
    topProducts: mockProducts.filter((p) => p.featured).slice(0, 5),
  }
}

let isAuthenticated = false
let currentUser: User | null = null

export function login(email: string, password: string): boolean {
  const user = mockUsers.find((u) => u.email === email)
  if (user && user.status === "active") {
    isAuthenticated = true
    currentUser = user
    return true
  }
  return false
}

export function logout(): void {
  isAuthenticated = false
  currentUser = null
}

export function isAuthenticatedUser(): boolean {
  return isAuthenticated
}

export function getCurrentUser(): User | null {
  return currentUser
}

export function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  mobile: string
  password: string
}): boolean {
  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === userData.email)
  if (existingUser) {
    return false
  }

  // Create new user with mobile number
  const newUser: User = {
    id: mockUsers.length + 1,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    mobile: userData.mobile, // Store mobile number
    role: "user",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Add to mock users array
  mockUsers.push(newUser)
  return true
}

export const getMockOrders = (): ProfileOrder[] => {
  return [
    {
      id: "ORD001",
      customerInfo: {
        name: "John Doe",
        email: "john@example.com",
        mobile: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
      },
      items: [
        {
          id: 1,
          name: "Custom T-Shirt",
          price: 29.99,
          quantity: 1,
          image: "/placeholder.svg?height=300&width=300&query=custom+t-shirt",
          customization: {
            size: "M",
            color: "#000000",
            design: [],
          },
        },
      ],
      total: 29.99,
      status: "delivered",
      paymentMethod: "Credit Card",
      date: "2024-01-15",
    },
    {
      id: "ORD002",
      customerInfo: {
        name: "Jane Smith",
        email: "jane@example.com",
        mobile: "+1 (555) 987-6543",
        address: "456 Oak Ave, Los Angeles, CA 90210",
      },
      items: [
        {
          id: 2,
          name: "Premium Hoodie",
          price: 79.99,
          quantity: 1,
          image: "/placeholder.svg?height=300&width=300&query=premium+hoodie",
        },
      ],
      total: 79.99,
      status: "processing",
      paymentMethod: "Cash on Delivery",
      date: "2024-01-20",
    },
  ]
}
