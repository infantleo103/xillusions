const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB || "final";

async function seedCustomizableProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const productsCollection = db.collection('products');
    
    // Check if customizable products already exist
    const existingCustomProducts = await productsCollection.countDocuments({ 
      category: 'custom',
      productFor: 'customization'
    });
    
    if (existingCustomProducts > 0) {
      console.log('Customizable products already exist. Skipping seeding.');
      return;
    }
    
    // Sample customizable products
    const customizableProducts = [
      {
        name: "Custom T-Shirt",
        description: "Create your own unique design on our premium cotton t-shirt. Perfect for personal expression or gifts.",
        price: 29.99,
        originalPrice: 39.99,
        category: "custom",
        productFor: "customization",
        customizable: true,
        customOptions: ["Text", "Images", "Colors", "Placement"],
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        ],
        rating: 4.8,
        reviews: 124,
        inStock: true,
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Red", "Green"],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Custom Hoodie",
        description: "Design your own hoodie with our easy-to-use customization tool. Warm, comfortable, and uniquely yours.",
        price: 49.99,
        originalPrice: 59.99,
        category: "custom",
        productFor: "customization",
        customizable: true,
        customOptions: ["Text", "Images", "Colors", "Placement"],
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1565693413579-8a73fcc8efcd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        ],
        rating: 4.9,
        reviews: 89,
        inStock: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Gray", "Navy", "Maroon"],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Custom Tank Top",
        description: "Create a personalized tank top perfect for workouts, casual wear, or special events. Lightweight and durable.",
        price: 24.99,
        originalPrice: 29.99,
        category: "custom",
        productFor: "customization",
        customizable: true,
        customOptions: ["Text", "Images", "Colors", "Placement"],
        image: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1503342250614-aabb357e6582?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        ],
        rating: 4.7,
        reviews: 56,
        inStock: true,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Black", "Gray", "Blue", "Pink"],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Custom Long Sleeve Shirt",
        description: "Design your own long sleeve shirt for cooler weather. Comfortable fabric with your personal touch.",
        price: 34.99,
        originalPrice: 44.99,
        category: "custom",
        productFor: "customization",
        customizable: true,
        customOptions: ["Text", "Images", "Colors", "Placement"],
        image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1618354691229-88d47f285158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        ],
        rating: 4.6,
        reviews: 42,
        inStock: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Burgundy", "Forest Green"],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Custom Polo Shirt",
        description: "Create a personalized polo shirt perfect for business casual, events, or everyday wear. Premium quality fabric.",
        price: 39.99,
        originalPrice: 49.99,
        category: "custom",
        productFor: "customization",
        customizable: true,
        customOptions: ["Text", "Images", "Colors", "Placement"],
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        ],
        rating: 4.8,
        reviews: 67,
        inStock: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Light Blue", "Red"],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert customizable products
    const result = await productsCollection.insertMany(customizableProducts);
    
    console.log(`${result.insertedCount} customizable products inserted successfully`);
  } catch (error) {
    console.error('Error seeding customizable products:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedCustomizableProducts().catch(console.error);