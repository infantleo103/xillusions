"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Inventory Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Track stock levels and manage inventory</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Responsive filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Responsive stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div>Total Items</div>
            <div>150</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div>In Stock</div>
            <div>120</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div>Out of Stock</div>
            <div>30</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div>Low Stock</div>
            <div>10</div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive inventory table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Product</TableHead>
                  <TableHead className="min-w-[100px]">SKU</TableHead>
                  <TableHead className="min-w-[100px]">Stock</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Last Updated</TableHead>
                  <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Example Product 1</TableCell>
                  <TableCell>SKU-001</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>In Stock</TableCell>
                  <TableCell>2023-10-26</TableCell>
                  <TableCell className="text-right">Edit | Delete</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Example Product 2</TableCell>
                  <TableCell>SKU-002</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>Out of Stock</TableCell>
                  <TableCell>2023-10-25</TableCell>
                  <TableCell className="text-right">Edit | Delete</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
