import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://infantleo308:uF5KD63MnXcxR7bf@xillusions.njcy9l0.mongodb.net/?retryWrites=true&w=majority&appName=xillusions";
const dbName = process.env.MONGODB_DB || "xillusions";

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  await client.connect();
  return client.db(dbName);
}

export async function GET(request) {
  try {
    // Get the time period from the query parameters
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get('timePeriod') || 'daily';
    const dateRange = searchParams.get('dateRange') || 'last-7-days';
    
    // Connect to the database
    const db = await connectToDatabase();
    
    // Get collections
    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');
    const productsCollection = db.collection('products');
    const visitsCollection = db.collection('visits');
    
    // Calculate date ranges based on the dateRange parameter
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'last-7-days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last-30-days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last-90-days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        break;
      case 'last-year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    // Calculate previous period for growth comparison
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    
    switch (dateRange) {
      case 'last-7-days':
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case 'last-30-days':
        previousStartDate.setDate(previousStartDate.getDate() - 30);
        break;
      case 'last-90-days':
        previousStartDate.setDate(previousStartDate.getDate() - 90);
        break;
      case 'last-year':
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        break;
    }
    
    // Get total users
    const totalUsers = await usersCollection.countDocuments({
      createdAt: { $lte: now }
    });
    
    // Get new users in the current period
    const newUsers = await usersCollection.countDocuments({
      createdAt: { $gte: startDate, $lte: now }
    });
    
    // Get new users in the previous period
    const previousPeriodUsers = await usersCollection.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: startDate }
    });
    
    // Calculate user growth
    const userGrowth = previousPeriodUsers > 0 
      ? ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0;
    
    // Get orders in the current period
    const orders = await ordersCollection.find({
      createdAt: { $gte: startDate, $lte: now }
    }).toArray();
    
    // Get orders in the previous period
    const previousPeriodOrders = await ordersCollection.find({
      createdAt: { $gte: previousStartDate, $lt: startDate }
    }).toArray();
    
    // Calculate total orders and revenue
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Calculate previous period orders and revenue
    const previousTotalOrders = previousPeriodOrders.length;
    const previousTotalRevenue = previousPeriodOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Calculate growth
    const orderGrowth = previousTotalOrders > 0 
      ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100 
      : 0;
    
    const revenueGrowth = previousTotalRevenue > 0 
      ? ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100 
      : 0;
    
    // Calculate conversion rate (orders / visits)
    const visits = await visitsCollection.countDocuments({
      timestamp: { $gte: startDate, $lte: now }
    });
    
    const previousVisits = await visitsCollection.countDocuments({
      timestamp: { $gte: previousStartDate, $lt: startDate }
    });
    
    const conversionRate = visits > 0 ? (totalOrders / visits) * 100 : 0;
    const previousConversionRate = previousVisits > 0 ? (previousTotalOrders / previousVisits) * 100 : 0;
    
    const conversionGrowth = previousConversionRate > 0 
      ? ((conversionRate - previousConversionRate) / previousConversionRate) * 100 
      : 0;
    
    // Get top products
    const topProducts = await ordersCollection.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: now } } },
      { $unwind: "$items" },
      { $group: {
          _id: "$items.productId",
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 4 },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $project: {
          _id: 0,
          name: "$product.name",
          sales: 1,
          revenue: 1
        }
      }
    ]).toArray();
    
    // Get device breakdown
    const deviceData = await visitsCollection.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: now } } },
      { $group: {
          _id: "$device",
          count: { $sum: 1 }
        }
      },
      { $project: {
          _id: 0,
          name: "$_id",
          value: { $multiply: [{ $divide: ["$count", visits] }, 100] }
        }
      }
    ]).toArray();
    
    // If no device data, use default values
    if (deviceData.length === 0) {
      deviceData.push(
        { name: "Desktop", value: 45, color: "#8884d8" },
        { name: "Mobile", value: 35, color: "#82ca9d" },
        { name: "Tablet", value: 20, color: "#ffc658" }
      );
    } else {
      // Add colors
      const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];
      deviceData.forEach((device, index) => {
        device.color = colors[index % colors.length];
      });
    }
    
    // Get traffic sources
    const trafficSources = await visitsCollection.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: now } } },
      { $group: {
          _id: "$source",
          visitors: { $sum: 1 }
        }
      },
      { $project: {
          _id: 0,
          source: "$_id",
          visitors: 1,
          percentage: { $multiply: [{ $divide: ["$visitors", visits] }, 100] }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    // If no traffic sources, use default values
    if (trafficSources.length === 0) {
      trafficSources.push(
        { source: "Organic Search", visitors: 3420, percentage: 42 },
        { source: "Direct", visitors: 2180, percentage: 27 },
        { source: "Social Media", visitors: 1340, percentage: 16 },
        { source: "Email", visitors: 890, percentage: 11 },
        { source: "Paid Ads", visitors: 320, percentage: 4 }
      );
    }
    
    // Generate chart data based on time period
    let chartData = [];
    
    if (timePeriod === 'daily') {
      // Daily data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        
        // Get data for this day
        const dayOrders = await ordersCollection.find({
          createdAt: { $gte: date, $lt: nextDate }
        }).toArray();
        
        const dayUsers = await usersCollection.countDocuments({
          createdAt: { $gte: date, $lt: nextDate }
        });
        
        const daySessions = await visitsCollection.countDocuments({
          timestamp: { $gte: date, $lt: nextDate }
        });
        
        const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        // Get day name
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[date.getDay()];
        
        chartData.push({
          period: dayName,
          users: dayUsers,
          revenue: dayRevenue,
          orders: dayOrders.length,
          sessions: daySessions
        });
      }
    } else if (timePeriod === 'weekly') {
      // Weekly data for the last 6 weeks
      for (let i = 5; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        
        // Get data for this week
        const weekOrders = await ordersCollection.find({
          createdAt: { $gte: weekStart, $lt: weekEnd }
        }).toArray();
        
        const weekUsers = await usersCollection.countDocuments({
          createdAt: { $gte: weekStart, $lt: weekEnd }
        });
        
        const weekSessions = await visitsCollection.countDocuments({
          timestamp: { $gte: weekStart, $lt: weekEnd }
        });
        
        const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        chartData.push({
          period: `Week ${i + 1}`,
          users: weekUsers,
          revenue: weekRevenue,
          orders: weekOrders.length,
          sessions: weekSessions
        });
      }
    } else if (timePeriod === 'monthly') {
      // Monthly data for the last 12 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now);
        monthStart.setMonth(now.getMonth() - i);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthStart.getMonth() + 1);
        
        // Get data for this month
        const monthOrders = await ordersCollection.find({
          createdAt: { $gte: monthStart, $lt: monthEnd }
        }).toArray();
        
        const monthUsers = await usersCollection.countDocuments({
          createdAt: { $gte: monthStart, $lt: monthEnd }
        });
        
        const monthSessions = await visitsCollection.countDocuments({
          timestamp: { $gte: monthStart, $lt: monthEnd }
        });
        
        const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        chartData.push({
          period: monthNames[monthStart.getMonth()],
          users: monthUsers,
          revenue: monthRevenue,
          orders: monthOrders.length,
          sessions: monthSessions
        });
      }
    }
    
    // Construct the response object
    const analyticsData = {
      [timePeriod]: {
        overview: {
          totalUsers,
          totalRevenue,
          totalOrders,
          conversionRate,
          growth: {
            users: userGrowth,
            revenue: revenueGrowth,
            orders: orderGrowth,
            conversion: conversionGrowth
          }
        },
        chartData,
        topProducts,
        deviceData,
        trafficSources
      }
    };
    
    return NextResponse.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching analytics data' },
      { status: 500 }
    );
  }
}