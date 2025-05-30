"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Percent, DollarSign, Tag } from 'lucide-react'

export default function PricingOffersPage() {
  const [basePricing, setBasePricing] = useState({
    tshirtBase: 299,
    imageUpload: 50,
    textCustomization: 20,
    fullBodyDesign: 100,
    premiumFonts: 15,
    rushOrder: 100,
  })

  const [coupons] = useState([
    {
      id: 1,
      code: "FIRST10",
      description: "10% off for first-time customers",
      type: "percentage",
      value: 10,
      minOrder: 500,
      maxDiscount: 100,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      usageLimit: 1000,
      usedCount: 245,
      status: "active",
    },
    {
      id: 2,
      code: "BULK20",
      description: "₹200 off on orders above ₹1000",
      type: "fixed",
      value: 200,
      minOrder: 1000,
      maxDiscount: 200,
      validFrom: "2024-01-01",
      validTo: "2024-06-30",
      usageLimit: 500,
      usedCount: 89,
      status: "active",
    },
  ])

  const [bulkDiscounts] = useState([
    { quantity: 5, discount: 5, description: "5% off on 5+ items" },
    { quantity: 10, discount: 10, description: "10% off on 10+ items" },
    { quantity: 20, discount: 15, description: "15% off on 20+ items" },
    { quantity: 50, discount: 20, description: "20% off on 50+ items" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pricing & Offers Management</h1>
      </div>

      <Tabs defaultValue="base-pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="base-pricing">Base Pricing</TabsTrigger>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="bulk-discounts">Bulk Discounts</TabsTrigger>
          <TabsTrigger value="seasonal-offers">Seasonal Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="base-pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Base Pricing Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="tshirtBase">T-Shirt Base Price (₹)</Label>
                  <Input 
                    id="tshirtBase" 
                    type="number" 
                    value={basePricing.tshirtBase}
                    onChange={(e) => setBasePricing({...basePricing, tshirtBase: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="imageUpload">Image/Logo Upload (₹)</Label>
                  <Input 
                    id="imageUpload" 
                    type="number" 
                    value={basePricing.imageUpload}
                    onChange={(e) => setBasePricing({...basePricing, imageUpload: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="textCustomization">Text Customization (₹)</Label>
                  <Input 
                    id="textCustomization" 
                    type="number" 
                    value={basePricing.textCustomization}
                    onChange={(e) => setBasePricing({...basePricing, textCustomization: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="fullBodyDesign">Full Body Design (₹)</Label>
                  <Input 
                    id="fullBodyDesign" 
                    type="number" 
                    value={basePricing.fullBodyDesign}
                    onChange={(e) => setBasePricing({...basePricing, fullBodyDesign: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="premiumFonts">Premium Fonts (₹)</Label>
                  <Input 
                    id="premiumFonts" 
                    type="number" 
                    value={basePricing.premiumFonts}
                    onChange={(e) => setBasePricing({...basePricing, premiumFonts: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="rushOrder">Rush Order (₹)</Label>
                  <Input 
                    id="rushOrder" 
                    type="number" 
                    value={basePricing.rushOrder}
                    onChange={(e) => setBasePricing({...basePricing, rushOrder: Number(e.target.value)})}
                  />
                </div>
              </div>
              <Button>Update Base Pricing</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Calculator Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Sample Order Calculation:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>T-Shirt Base Price:</span>
                    <span>₹{basePricing.tshirtBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Upload:</span>
                    <span>₹{basePricing.imageUpload}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Text Customization:</span>
                    <span>₹{basePricing.textCustomization}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{basePricing.tshirtBase + basePricing.imageUpload + basePricing.textCustomization}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Coupon Codes Management
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                      <TableCell>{coupon.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {coupon.type === "percentage" ? "%" : "₹"} {coupon.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}</TableCell>
                      <TableCell>₹{coupon.minOrder}</TableCell>
                      <TableCell>
                        {coupon.usedCount}/{coupon.usageLimit}
                      </TableCell>
                      <TableCell>{coupon.validTo}</TableCell>
                      <TableCell>
                        <Badge variant={coupon.status === "active" ? "default" : "secondary"}>{coupon.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="bulk-discounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Bulk Discount Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkDiscounts.map((tier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{tier.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tier.quantity}+ items get {tier.discount}% discount
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Tier
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal-offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Offers & Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No seasonal offers configured</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Seasonal Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
