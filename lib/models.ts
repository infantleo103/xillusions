/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         description:
 *           type: string
 *           description: Optional description of the category
 *         image:
 *           type: string
 *           description: URL to the category image
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Status of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was last updated
 *       example:
 *         id: "60d21b4667d0d8992e610c85"
 *         name: "Men's Clothing"
 *         slug: "mens-clothing"
 *         description: "Clothing items for men"
 *         image: "https://example.com/images/mens-clothing.jpg"
 *         status: "active"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerInfo
 *         - items
 *         - total
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         customerInfo:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Customer's full name
 *             email:
 *               type: string
 *               description: Customer's email address
 *             mobile:
 *               type: string
 *               description: Customer's mobile number
 *             address:
 *               type: string
 *               description: Customer's shipping address
 *         items:
 *           type: array
 *           description: List of items in the order
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: Product ID
 *               name:
 *                 type: string
 *                 description: Product name
 *               price:
 *                 type: number
 *                 description: Product price
 *               quantity:
 *                 type: number
 *                 description: Quantity ordered
 *               image:
 *                 type: string
 *                 description: Product image URL
 *               customization:
 *                 type: object
 *                 description: Custom options for the product
 *         total:
 *           type: number
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [processing, shipped, delivered, cancelled]
 *           description: Current status of the order
 *         paymentMethod:
 *           type: string
 *           description: Method of payment
 *         date:
 *           type: string
 *           description: Date the order was placed
 *       example:
 *         id: "60d21b4667d0d8992e610c85"
 *         customerInfo:
 *           name: "John Doe"
 *           email: "john@example.com"
 *           mobile: "+1234567890"
 *           address: "123 Main St, City, Country"
 *         items:
 *           - id: 1
 *             name: "T-Shirt"
 *             price: 29.99
 *             quantity: 2
 *             image: "https://example.com/images/tshirt.jpg"
 *         total: 59.98
 *         status: "processing"
 *         paymentMethod: "credit_card"
 *         date: "2023-01-01T00:00:00.000Z"
 */
export interface Order {
  id: string
  customerInfo: {
    name: string
    email: string
    mobile: string
    address: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image?: string
    customization?: any
  }>
  total: number
  status: "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  date: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email address
 *         mobile:
 *           type: string
 *           description: User's mobile number
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User's role in the system
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               description: Street address
 *             city:
 *               type: string
 *               description: City
 *             state:
 *               type: string
 *               description: State or province
 *             zipCode:
 *               type: string
 *               description: Postal or ZIP code
 *             country:
 *               type: string
 *               description: Country
 *       example:
 *         id: "60d21b4667d0d8992e610c85"
 *         name: "John Doe"
 *         email: "john@example.com"
 *         mobile: "+1234567890"
 *         role: "user"
 *         address:
 *           street: "123 Main St"
 *           city: "New York"
 *           state: "NY"
 *           zipCode: "10001"
 *           country: "USA"
 */
export interface User {
  id: string
  name: string
  email: string
  mobile: string
  role: "user" | "admin"
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Product name
 *         category:
 *           type: string
 *           description: Product category
 *         price:
 *           type: number
 *           description: Current price
 *         originalPrice:
 *           type: number
 *           description: Original price before discount
 *         description:
 *           type: string
 *           description: Product description
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *         image:
 *           type: string
 *           description: Main product image URL
 *         frontImage:
 *           type: string
 *           description: Front view image URL
 *         backImage:
 *           type: string
 *           description: Back view image URL
 *         badge:
 *           type: string
 *           description: Product badge (e.g., "New", "Sale")
 *         productFor:
 *           type: string
 *           enum: [sale, customization]
 *           description: Whether the product is for sale or customization
 *         rating:
 *           type: number
 *           description: Average product rating
 *         reviews:
 *           type: number
 *           description: Number of reviews
 *         featured:
 *           type: boolean
 *           description: Whether the product is featured
 *         customizable:
 *           type: boolean
 *           description: Whether the product can be customized
 *         inStock:
 *           type: boolean
 *           description: Whether the product is in stock
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: Available sizes
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           description: Available colors
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was last updated
 *       example:
 *         id: "60d21b4667d0d8992e610c85"
 *         name: "Classic White T-Shirt"
 *         category: "men"
 *         price: 29.99
 *         originalPrice: 39.99
 *         description: "Premium cotton classic white t-shirt perfect for everyday wear"
 *         stock: 50
 *         image: "/placeholder.svg?height=400&width=400&query=white+t-shirt"
 *         frontImage: "/placeholder.svg?height=400&width=400&query=white+t-shirt+front"
 *         backImage: "/placeholder.svg?height=400&width=400&query=white+t-shirt+back"
 *         badge: "Best Seller"
 *         productFor: "customization"
 *         rating: 4.5
 *         reviews: 128
 *         featured: true
 *         customizable: true
 *         inStock: true
 *         sizes: ["S", "M", "L", "XL"]
 *         colors: ["White", "Black", "Gray"]
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 */
export interface Product {
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
  createdAt: Date
  updatedAt: Date
}
