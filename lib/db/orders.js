import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB || "final";

// Get all orders with optional filters
export async function getOrders(filters = {}) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    
    // Build query based on filters
    const query = {};
    
    if (filters.search) {
      query.$or = [
        { orderNumber: { $regex: filters.search, $options: 'i' } },
        { 'customerInfo.firstName': { $regex: filters.search, $options: 'i' } },
        { 'customerInfo.lastName': { $regex: filters.search, $options: 'i' } },
        { 'customerInfo.email': { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom);
      }
      
      if (filters.dateTo) {
        // Add one day to include the end date fully
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query.createdAt.$lt = endDate;
      }
    }
    
    // Execute query with sort by createdAt descending (newest first)
    const orders = await ordersCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    // Convert MongoDB _id to id for frontend compatibility
    return orders.map(order => ({
      ...order,
      id: order._id.toString()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  } finally {
    await client.close();
  }
}

// Get a single order by ID
export async function getOrderById(id) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    
    if (!order) {
      return null;
    }
    
    return {
      ...order,
      id: order._id.toString()
    };
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  } finally {
    await client.close();
  }
}

// Update order status
export async function updateOrderStatus(id, status) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Order not found'
      };
    }
    
    return {
      success: true,
      status: status
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await client.close();
  }
}

// Create a new order
export async function createOrder(orderData) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    const countersCollection = db.collection('counters');
    
    // Generate order number
    const counterDoc = await countersCollection.findOneAndUpdate(
      { _id: 'orderNumber' },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    
    const orderNumber = `ORD-${String(counterDoc.seq).padStart(6, '0')}`;
    
    // Process items to ensure customization data is properly structured
    const processedItems = orderData.items.map(item => {
      // If item has customization data, ensure all required fields are present
      if (item.customization) {
        // Ensure customization data is properly structured
        const customization = {
          productId: item.customization.productId,
          elements: item.customization.elements.map(element => ({
            id: element.id,
            type: element.type,
            content: element.content,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            rotation: element.rotation,
            fontSize: element.fontSize || null,
            fontFamily: element.fontFamily || null,
            color: element.color || null,
            zIndex: element.zIndex,
            side: element.side || 'front',
            originalImageUrl: element.originalImageUrl || null
          })),
          frontPreviewImage: item.customization.frontPreviewImage || null,
          backPreviewImage: item.customization.backPreviewImage || null,
          previewImage: item.customization.previewImage || item.customization.frontPreviewImage || null,
          originalProductImage: item.customization.originalProductImage || item.image || null
        };
        
        return {
          ...item,
          customization
        };
      }
      return item;
    });
    
    // Add timestamps and order number
    const newOrder = {
      ...orderData,
      items: processedItems,
      orderNumber,
      status: orderData.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await ordersCollection.insertOne(newOrder);
    
    if (result.acknowledged) {
      return {
        success: true,
        order: {
          ...newOrder,
          id: result.insertedId.toString()
        }
      };
    } else {
      return {
        success: false,
        error: 'Failed to create order'
      };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await client.close();
  }
}

// Seed sample orders if none exist
export async function seedOrders() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    
    // Check if orders already exist
    const count = await ordersCollection.countDocuments();
    
    if (count > 0) {
      console.log('Orders collection already has data. Skipping seeding.');
      return;
    }
    
    // Sample orders data
    const sampleOrders = [
      {
        orderNumber: 'ORD-000001',
        customerInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001'
        },
        items: [
          {
            id: '1',
            name: 'Classic White T-Shirt',
            price: 29.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          },
          {
            id: '2',
            name: 'Premium Black T-Shirt',
            price: 34.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          }
        ],
        subtotal: 94.97,
        tax: 7.60,
        discount: 0,
        total: 102.57,
        status: 'delivered',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)  // 25 days ago
      },
      {
        orderNumber: 'ORD-000002',
        customerInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001'
        },
        items: [
          {
            id: '3',
            name: 'Women\'s Fitted T-Shirt',
            price: 32.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          }
        ],
        subtotal: 32.99,
        tax: 2.64,
        discount: 5.00,
        total: 30.63,
        status: 'shipped',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)  // 12 days ago
      },
      {
        orderNumber: 'ORD-000003',
        customerInfo: {
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          address: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zip: '60007'
        },
        items: [
          {
            id: '4',
            name: 'Custom Design T-Shirt',
            price: 39.99,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          }
        ],
        subtotal: 119.97,
        tax: 9.60,
        discount: 0,
        total: 129.57,
        status: 'processing',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)  // 4 days ago
      },
      {
        orderNumber: 'ORD-000004',
        customerInfo: {
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@example.com',
          address: '101 Maple Dr',
          city: 'Houston',
          state: 'TX',
          zip: '77001'
        },
        items: [
          {
            id: '5',
            name: 'New Arrival Graphic Tee',
            price: 36.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          },
          {
            id: '1',
            name: 'Classic White T-Shirt',
            price: 29.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          }
        ],
        subtotal: 66.98,
        tax: 5.36,
        discount: 0,
        total: 72.34,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)   // 9 days ago
      },
      {
        orderNumber: 'ORD-000005',
        customerInfo: {
          firstName: 'Robert',
          lastName: 'Brown',
          email: 'robert.brown@example.com',
          address: '222 Cedar Ln',
          city: 'Miami',
          state: 'FL',
          zip: '33101'
        },
        items: [
          {
            id: '2',
            name: 'Premium Black T-Shirt',
            price: 34.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
          }
        ],
        subtotal: 69.98,
        tax: 5.60,
        discount: 10.00,
        total: 65.58,
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)  // 1 day ago
      }
    ];
    
    // Insert orders
    const result = await ordersCollection.insertMany(sampleOrders);
    
    console.log(`${result.insertedCount} orders inserted successfully`);
    
    return {
      success: true,
      count: result.insertedCount
    };
  } catch (error) {
    console.error('Error seeding orders:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await client.close();
  }
}