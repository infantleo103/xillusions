"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, ShoppingBag, Package, ArrowUp, ArrowDown, Bell } from 'lucide-react'
import { RevenueChart, SalesChart, ProductProfitTable } from "./client-components"

// Removed metadata since this is now a client component

// Memoized data to prevent recalculation on re-renders

const productCategoryData = [
  { name: "T-Shirts", value: 35 },
  { name: "Hoodies", value: 25 },
  { name: "Accessories", value: 20 },
  { name: "Custom", value: 15 },
  { name: "Other", value: 5 },
]

// Separate components for better code organization and performance
function StatCard({ title, value, description, icon, trend, trendValue }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-blue-100'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



function RecentOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/metrics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        
        const data = await response.json();
        
        if (data.success && data.metrics.recentOrders) {
          setOrders(data.metrics.recentOrders);
        }
      } catch (err) {
        console.error('Error fetching orders data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Get badge style based on status
  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return "bg-green-50 text-green-700 hover:bg-green-50";
      case 'delivered':
        return "bg-blue-50 text-blue-700 hover:bg-blue-50";
      case 'pending':
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50";
      case 'cancelled':
        return "bg-red-50 text-red-700 hover:bg-red-50";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Recent Orders
        </CardTitle>
        <CardDescription>Latest orders placed</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-red-500 py-8">
            Error loading data: {error}
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your recent orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.invoice}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeStyle(order.status)}
                        >
                          {order.status || 'Processing'}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.method}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No recent orders found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NotificationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
        <CardDescription>Recent system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">John Smith created an account</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <ShoppingBag className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium">New order placed</p>
                <p className="text-xs text-muted-foreground">Order #12345 was placed</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">5 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Package className="h-4 w-4 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Low stock alert</p>
                <p className="text-xs text-muted-foreground">Premium T-Shirt is running low</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">10 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <DollarSign className="h-4 w-4 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Revenue milestone</p>
                <p className="text-xs text-muted-foreground">Monthly target achieved</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">1 hour ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading fallbacks for better UX
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

// Stats Cards Component
function StatsCards() {
  const [metrics, setMetrics] = useState({
    totalRevenue: "0",
    totalProfit: "0",
    totalProducts: 0,
    totalUsers: 0,
    newUsers: 0,
    totalOrders30Days: 0,
    revenueTrend: "0",
    usersTrend: "0",
    ordersTrend: "0"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/metrics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        
        const data = await response.json();
        
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error('Error fetching metrics data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (isLoading) {
    return (
      <>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-4 text-center text-red-500 py-8">
        Error loading metrics: {error}
      </div>
    );
  }

  return (
    <>
      <StatCard 
        title="Total Revenue" 
        value={formatCurrency(metrics.totalRevenue)} 
        description="All time revenue" 
        icon={<DollarSign className="h-4 w-4 text-green-600" />}
        trend={parseFloat(metrics.revenueTrend) >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(parseFloat(metrics.revenueTrend)).toFixed(1)}% from last month`}
      />
      
      <StatCard 
        title="New Users" 
        value={metrics.newUsers.toString()} 
        description="Last 30 days" 
        icon={<Users className="h-4 w-4 text-blue-600" />}
        trend={parseFloat(metrics.usersTrend) >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(parseFloat(metrics.usersTrend)).toFixed(1)}% from last month`}
      />
      
      <StatCard 
        title="Orders" 
        value={metrics.totalOrders30Days.toString()} 
        description="Last 30 days" 
        icon={<ShoppingBag className="h-4 w-4 text-purple-600" />}
        trend={parseFloat(metrics.ordersTrend) >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(parseFloat(metrics.ordersTrend)).toFixed(1)}% from last month`}
      />
      
      <StatCard 
        title="Products" 
        value={metrics.totalProducts.toString()} 
        description="Total products" 
        icon={<Package className="h-4 w-4 text-orange-600" />}
        trend={null}
        trendValue={null}
      />
    </>
  );
}

// Main dashboard component
const Page = () => {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [authChecking, setAuthChecking] = useState(true)
  
  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/admin/login')
      } else if (user.role !== 'admin') {
        // Not an admin, redirect to home
        router.push('/')
      } else {
        setAuthChecking(false)
      }
    }
  }, [user, isLoading, router])
  
  // Show loading state while checking authentication
  if (authChecking) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Skeleton className="h-8 w-8 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName}! Here's an overview of your store</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Last updated: Just now</Badge>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCards />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        
        <Suspense fallback={<ChartSkeleton />}>
          <SalesChart />
        </Suspense>
      </div>

      {/* Product Profit Analysis */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <ProductProfitTable />
        </Suspense>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RecentOrdersTable />
        </Suspense>
        
        <Suspense fallback={<ChartSkeleton />}>
          <NotificationsCard />
        </Suspense>
      </div>
    </div>
  )
}

export default Page
