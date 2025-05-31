import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Get products collection
    const productsCollection = await getCollection('products');
    const ordersCollection = await getCollection('orders');
    
    // Get all products
    const products = await productsCollection.find({}).toArray();
    
    // Get all orders
    const orders = await ordersCollection.find({
      status: { $in: ['completed', 'delivered', 'shipped'] }
    }).toArray();
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);
    
    // Calculate revenue by product
    const productRevenue = {};
    const productSales = {};
    
    // Process orders to get revenue and sales by product
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!item.productId) return; // Skip items without productId
          const productId = item.productId.toString();
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          const revenue = quantity * price;
          
          if (!productRevenue[productId]) {
            productRevenue[productId] = 0;
          }
          if (!productSales[productId]) {
            productSales[productId] = 0;
          }
          
          productRevenue[productId] += revenue;
          productSales[productId] += quantity;
        });
      }
    });
    
    // Calculate profit for each product
    const productProfits = products.map(product => {
      if (!product._id) return null; // Skip products without _id
      const id = product._id.toString();
      const revenue = productRevenue[id] || 0;
      const sales = productSales[id] || 0;
      const cost = product.costPrice || 0;
      const profit = revenue - (cost * sales);
      
      return {
        id,
        name: product.name,
        revenue,
        sales,
        cost,
        profit,
        profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0
      };
    }).filter(Boolean); // Remove null entries
    
    // Sort products by profit (highest first)
    productProfits.sort((a, b) => b.profit - a.profit);
    
    // Calculate total profit
    const totalProfit = productProfits.reduce((sum, product) => sum + product.profit, 0);
    
    // Calculate daily revenue for the last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyRevenue = last7Days.map(date => {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayRevenue = orders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= dayStart && orderDate <= dayEnd) {
          return sum + (order.totalAmount || 0);
        }
        return sum;
      }, 0);
      
      return {
        date: date.split('-')[2], // Just the day
        value: dayRevenue
      };
    });
    
    // Calculate daily sales for the last 7 days
    const dailySales = last7Days.map(date => {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const daySales = orders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= dayStart && orderDate <= dayEnd) {
          return sum + 1; // Count each order as 1 sale
        }
        return sum;
      }, 0);
      
      return {
        date: date.split('-')[2], // Just the day
        value: daySales
      };
    });
    
    // Get recent orders (last 5)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order._id.toString(),
        invoice: order.orderNumber || order._id.toString().substring(0, 6).toUpperCase(),
        status: order.status,
        customer: order.customerName || 'Anonymous',
        method: order.paymentMethod || 'Unknown',
        amount: order.totalAmount || 0
      }));
    
    // Calculate total number of products
    const totalProducts = products.length;
    
    // Calculate total number of users
    const usersCollection = await getCollection('users');
    const totalUsers = await usersCollection.countDocuments();
    
    // Calculate new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await usersCollection.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Calculate total orders in the last 30 days
    const recentOrders30Days = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= thirtyDaysAgo;
    });
    
    const totalOrders30Days = recentOrders30Days.length;
    
    // Calculate percentage change in orders from previous 30 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const previousPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    });
    
    const previousPeriodOrderCount = previousPeriodOrders.length;
    const ordersTrend = previousPeriodOrderCount > 0 
      ? ((totalOrders30Days - previousPeriodOrderCount) / previousPeriodOrderCount) * 100 
      : 0;
    
    // Calculate percentage change in revenue from previous 30 days
    const recentRevenue = recentOrders30Days.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    const revenueTrend = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    
    // Calculate percentage change in users from previous 30 days
    const sixtyDaysAgoDate = new Date();
    sixtyDaysAgoDate.setDate(sixtyDaysAgoDate.getDate() - 60);
    
    const previousPeriodNewUsers = await usersCollection.countDocuments({
      createdAt: { $gte: sixtyDaysAgoDate, $lt: thirtyDaysAgo }
    });
    
    const usersTrend = previousPeriodNewUsers > 0 
      ? ((newUsers - previousPeriodNewUsers) / previousPeriodNewUsers) * 100 
      : 0;
    
    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue: totalRevenue.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        totalProducts,
        totalUsers,
        newUsers,
        totalOrders30Days,
        revenueTrend: revenueTrend.toFixed(1),
        usersTrend: usersTrend.toFixed(1),
        ordersTrend: ordersTrend.toFixed(1),
        productProfits: productProfits.slice(0, 10), // Top 10 products by profit
        dailyRevenue,
        dailySales,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching metrics' },
      { status: 500 }
    );
  }
}