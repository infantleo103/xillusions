"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, Download, Calendar, ArrowUp, ArrowDown, Activity, Target, Zap } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for different time periods
const mockData = {
  daily: {
    overview: {
      totalUsers: 1247,
      totalRevenue: 15420,
      totalOrders: 89,
      conversionRate: 3.2,
      growth: {
        users: 12.5,
        revenue: 8.3,
        orders: -2.1,
        conversion: 0.8
      }
    },
    chartData: [
      { period: "Mon", users: 180, revenue: 2100, orders: 12, sessions: 320 },
      { period: "Tue", users: 220, revenue: 2800, orders: 15, sessions: 380 },
      { period: "Wed", users: 190, revenue: 2200, orders: 11, sessions: 340 },
      { period: "Thu", users: 250, revenue: 3200, orders: 18, sessions: 420 },
      { period: "Fri", users: 280, revenue: 3800, orders: 22, sessions: 480 },
      { period: "Sat", users: 320, revenue: 4200, orders: 25, sessions: 520 },
      { period: "Sun", users: 290, revenue: 3900, orders: 21, sessions: 490 }
    ],
    topProducts: [
      { name: "Custom T-Shirt", sales: 45, revenue: 1350 },
      { name: "Premium Hoodie", sales: 32, revenue: 2560 },
      { name: "Baseball Cap", sales: 28, revenue: 700 },
      { name: "Phone Case", sales: 24, revenue: 480 }
    ]
  },
  weekly: {
    overview: {
      totalUsers: 8734,
      totalRevenue: 107940,
      totalOrders: 623,
      conversionRate: 3.8,
      growth: {
        users: 15.2,
        revenue: 12.7,
        orders: 8.9,
        conversion: 1.2
      }
    },
    chartData: [
      { period: "Week 1", users: 1200, revenue: 18500, orders: 105, sessions: 2100 },
      { period: "Week 2", users: 1450, revenue: 22300, orders: 128, sessions: 2450 },
      { period: "Week 3", users: 1380, revenue: 21200, orders: 118, sessions: 2300 },
      { period: "Week 4", users: 1520, revenue: 24800, orders: 142, sessions: 2680 },
      { period: "Week 5", users: 1680, revenue: 27400, orders: 156, sessions: 2890 },
      { period: "Week 6", users: 1504, revenue: 25640, orders: 134, sessions: 2520 }
    ],
    topProducts: [
      { name: "Custom T-Shirt", sales: 315, revenue: 9450 },
      { name: "Premium Hoodie", sales: 224, revenue: 17920 },
      { name: "Baseball Cap", sales: 196, revenue: 4900 },
      { name: "Phone Case", sales: 168, revenue: 3360 }
    ]
  },
  monthly: {
    overview: {
      totalUsers: 34896,
      totalRevenue: 431760,
      totalOrders: 2492,
      conversionRate: 4.1,
      growth: {
        users: 18.7,
        revenue: 22.4,
        orders: 16.3,
        conversion: 2.1
      }
    },
    chartData: [
      { period: "Jan", users: 4200, revenue: 62000, orders: 350, sessions: 8400 },
      { period: "Feb", users: 4800, revenue: 71500, orders: 410, sessions: 9600 },
      { period: "Mar", users: 5200, revenue: 78200, orders: 445, sessions: 10400 },
      { period: "Apr", users: 5600, revenue: 84300, orders: 485, sessions: 11200 },
      { period: "May", users: 6100, revenue: 92800, orders: 530, sessions: 12200 },
      { period: "Jun", users: 6400, revenue: 97600, orders: 560, sessions: 12800 },
      { period: "Jul", users: 6800, revenue: 103400, orders: 595, sessions: 13600 },
      { period: "Aug", users: 7200, revenue: 109200, orders: 625, sessions: 14400 },
      { period: "Sep", users: 7600, revenue: 115800, orders: 665, sessions: 15200 },
      { period: "Oct", users: 8000, revenue: 122400, orders: 705, sessions: 16000 },
      { period: "Nov", users: 8400, revenue: 128200, orders: 735, sessions: 16800 },
      { period: "Dec", users: 8896, revenue: 135760, orders: 782, sessions: 17792 }
    ],
    topProducts: [
      { name: "Custom T-Shirt", sales: 1260, revenue: 37800 },
      { name: "Premium Hoodie", sales: 896, revenue: 71680 },
      { name: "Baseball Cap", sales: 784, revenue: 19600 },
      { name: "Phone Case", sales: 672, revenue: 13440 }
    ]
  }
}

const deviceData = [
  { name: "Desktop", value: 45, color: "#8884d8" },
  { name: "Mobile", value: 35, color: "#82ca9d" },
  { name: "Tablet", value: 20, color: "#ffc658" }
]

const trafficSources = [
  { source: "Organic Search", visitors: 3420, percentage: 42 },
  { source: "Direct", visitors: 2180, percentage: 27 },
  { source: "Social Media", visitors: 1340, percentage: 16 },
  { source: "Email", visitors: 890, percentage: 11 },
  { source: "Paid Ads", visitors: 320, percentage: 4 }
]

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [dateRange, setDateRange] = useState("last-7-days")

  const currentData = mockData[timePeriod]

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatNumber = (value: number) => value.toLocaleString()
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value}%`

  const MetricCard = ({ title, value, growth, icon, format = "number" }) => {
    const isPositive = growth >= 0
    const formattedValue = format === "currency" ? formatCurrency(value) : 
                          format === "percentage" ? `${value}%` : 
                          formatNumber(value)

    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{formattedValue}</div>
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{formatPercentage(growth)} vs last {timePeriod.slice(0, -2)}</span>
          </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Period Toggle */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={currentData.overview.totalUsers}
          growth={currentData.overview.growth.users}
          icon={<Users className="h-4 w-4 text-blue-600" />}
        />
        <MetricCard
          title="Revenue"
          value={currentData.overview.totalRevenue}
          growth={currentData.overview.growth.revenue}
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
          format="currency"
        />
        <MetricCard
          title="Orders"
          value={currentData.overview.totalOrders}
          growth={currentData.overview.growth.orders}
          icon={<ShoppingCart className="h-4 w-4 text-purple-600" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={currentData.overview.conversionRate}
          growth={currentData.overview.growth.conversion}
          icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
          format="percentage"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "hsl(var(--chart-2))",
                },
                sessions: {
                  label: "Sessions",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="var(--color-sessions)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium">{device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatNumber(source.visitors)} visitors</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Orders Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              orders: {
                label: "Orders",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
