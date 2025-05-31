'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { TrendingUp, ShoppingBag, DollarSign, Percent } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from 'react';

// Default data for initial render
const defaultRevenueData = [
  { date: "01", value: 0 },
  { date: "02", value: 0 },
  { date: "03", value: 0 },
  { date: "04", value: 0 },
  { date: "05", value: 0 },
  { date: "06", value: 0 },
  { date: "07", value: 0 },
];

const defaultSalesData = [
  { date: "01", value: 0 },
  { date: "02", value: 0 },
  { date: "03", value: 0 },
  { date: "04", value: 0 },
  { date: "05", value: 0 },
  { date: "06", value: 0 },
  { date: "07", value: 0 },
];

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState(defaultRevenueData);
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
        
        if (data.success && data.metrics.dailyRevenue) {
          setRevenueData(data.metrics.dailyRevenue);
        }
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Revenue Chart
        </CardTitle>
        <CardDescription>Revenue over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-red-500 py-8">
            Error loading data: {error}
          </div>
        ) : (
          <ChartContainer
            config={{
              value: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-value)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function SalesChart() {
  const [salesData, setSalesData] = useState(defaultSalesData);
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
        
        if (data.success && data.metrics.dailySales) {
          setSalesData(data.metrics.dailySales);
        }
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Sales Chart
        </CardTitle>
        <CardDescription>Sales over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-red-500 py-8">
            Error loading data: {error}
          </div>
        ) : (
          <ChartContainer
            config={{
              value: {
                label: "Sales",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-value)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function ProductProfitTable() {
  const [productProfits, setProductProfits] = useState([]);
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
        
        if (data.success && data.metrics.productProfits) {
          setProductProfits(data.metrics.productProfits);
        }
      } catch (err) {
        console.error('Error fetching product profit data:', err);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Product Profit Analysis
        </CardTitle>
        <CardDescription>Top products by profit margin</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center text-red-500 py-8">
            Error loading data: {error}
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">Loading product data...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your top products by profit.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productProfits.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{formatCurrency(product.revenue)}</TableCell>
                    <TableCell>{formatCurrency(product.cost)}</TableCell>
                    <TableCell>{formatCurrency(product.profit)}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${product.profitMargin > 30 ? 'bg-green-50 text-green-700' : 
                            product.profitMargin > 15 ? 'bg-blue-50 text-blue-700' : 
                            product.profitMargin > 0 ? 'bg-yellow-50 text-yellow-700' : 
                            'bg-red-50 text-red-700'}
                        `}
                      >
                        {product.profitMargin.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}