"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Eye, Filter, Package, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface ProductionOrder {
  id: string
  orderNumber: string
  customerName: string
  productName: string
  size: string
  color: string
  customization: {
    frontDesign?: string
    backDesign?: string
    textElements: Array<{ text: string; position: string; font: string; color: string }>
    imageElements: Array<{ position: string; size: string }>
  }
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-production" | "quality-check" | "completed" | "on-hold"
  orderDate: Date
  dueDate: Date
  estimatedTime: number // in hours
  assignedTo?: string
}

export default function ProductionQueuePage() {
  const [orders] = useState<ProductionOrder[]>([
    {
      id: "PROD001",
      orderNumber: "ORD-001234",
      customerName: "John Doe",
      productName: "Classic Cotton T-Shirt",
      size: "L",
      color: "Black",
      customization: {
        frontDesign: "Custom Logo",
        textElements: [{ text: "TEAM ALPHA", position: "Front Center", font: "Arial", color: "#FFFFFF" }],
        imageElements: [{ position: "Front Center", size: "Medium" }],
      },
      priority: "high",
      status: "pending",
      orderDate: new Date("2024-01-15"),
      dueDate: new Date("2024-01-20"),
      estimatedTime: 4,
    },
    {
      id: "PROD002",
      orderNumber: "ORD-001235",
      customerName: "Jane Smith",
      productName: "Premium Blend T-Shirt",
      size: "M",
      color: "White",
      customization: {
        backDesign: "Custom Text",
        textElements: [{ text: "CREATIVE MIND", position: "Back Center", font: "Helvetica", color: "#000000" }],
        imageElements: [],
      },
      priority: "medium",
      status: "in-production",
      orderDate: new Date("2024-01-16"),
      dueDate: new Date("2024-01-22"),
      estimatedTime: 3,
      assignedTo: "Production Team A",
    },
  ])

  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date>()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in-production":
        return "default"
      case "quality-check":
        return "outline"
      case "completed":
        return "default"
      case "on-hold":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-production":
        return <Package className="h-4 w-4" />
      case "quality-check":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false
    if (priorityFilter !== "all" && order.priority !== priorityFilter) return false
    if (dateFilter && format(order.dueDate, "yyyy-MM-dd") !== format(dateFilter, "yyyy-MM-dd")) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Production Queue</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Production Sheet
          </Button>
          <Button>Generate Print Specs</Button>
        </div>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Production</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "in-production").length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quality Check</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "quality-check").length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "completed").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="queue">Production Queue</TabsTrigger>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="teams">Team Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-production">In Production</SelectItem>
                      <SelectItem value="quality-check">Quality Check</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter("all")
                      setPriorityFilter("all")
                      setDateFilter(undefined)
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Queue Table */}
          <Card>
            <CardHeader>
              <CardTitle>Production Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customization</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.size} • {order.color}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.customization.frontDesign && (
                            <Badge variant="outline" className="text-xs">
                              Front: {order.customization.frontDesign}
                            </Badge>
                          )}
                          {order.customization.backDesign && (
                            <Badge variant="outline" className="text-xs">
                              Back: {order.customization.backDesign}
                            </Badge>
                          )}
                          {order.customization.textElements.map((text, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              Text: {text.text}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{format(order.dueDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>{order.estimatedTime}h</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Production schedule calendar view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Team Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Team assignment and workload management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
