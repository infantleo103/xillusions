"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Type, Palette } from "lucide-react"

export default function CustomizationOptionsPage() {
  const [customizationRules, setCustomizationRules] = useState({
    imageUploadCost: 50,
    textAreaCost: 20,
    fullBodyDesignCost: 100,
    maxImageSize: 5, // MB
    allowedImageFormats: ["PNG", "JPG", "JPEG", "SVG"],
    maxTextLength: 100,
    printPositions: ["Front", "Back", "Left Sleeve", "Right Sleeve"],
  })

  const [fontOptions] = useState([
    { name: "Arial", category: "Sans-serif", cost: 0 },
    { name: "Times New Roman", category: "Serif", cost: 0 },
    { name: "Helvetica", category: "Sans-serif", cost: 10 },
    { name: "Georgia", category: "Serif", cost: 10 },
    { name: "Impact", category: "Display", cost: 15 },
    { name: "Comic Sans MS", category: "Casual", cost: 5 },
  ])

  const [printAreas] = useState([
    { name: "Front Center", width: 200, height: 250, x: 100, y: 50 },
    { name: "Back Center", width: 200, height: 250, x: 100, y: 50 },
    { name: "Left Chest", width: 80, height: 80, x: 50, y: 30 },
    { name: "Right Sleeve", width: 60, height: 150, x: 20, y: 40 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customization Options Management</h1>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
          <TabsTrigger value="fonts">Font Management</TabsTrigger>
          <TabsTrigger value="print-areas">Print Areas</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Customization Pricing Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="imageUploadCost">Image/Logo Upload Cost (₹)</Label>
                  <Input
                    id="imageUploadCost"
                    type="number"
                    value={customizationRules.imageUploadCost}
                    onChange={(e) =>
                      setCustomizationRules({
                        ...customizationRules,
                        imageUploadCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="textAreaCost">Text Area Cost (₹)</Label>
                  <Input
                    id="textAreaCost"
                    type="number"
                    value={customizationRules.textAreaCost}
                    onChange={(e) =>
                      setCustomizationRules({
                        ...customizationRules,
                        textAreaCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fullBodyDesignCost">Full Body Design Cost (₹)</Label>
                  <Input
                    id="fullBodyDesignCost"
                    type="number"
                    value={customizationRules.fullBodyDesignCost}
                    onChange={(e) =>
                      setCustomizationRules({
                        ...customizationRules,
                        fullBodyDesignCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxImageSize">Max Image Size (MB)</Label>
                  <Input
                    id="maxImageSize"
                    type="number"
                    value={customizationRules.maxImageSize}
                    onChange={(e) =>
                      setCustomizationRules({
                        ...customizationRules,
                        maxImageSize: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxTextLength">Max Text Length (characters)</Label>
                  <Input
                    id="maxTextLength"
                    type="number"
                    value={customizationRules.maxTextLength}
                    onChange={(e) =>
                      setCustomizationRules({
                        ...customizationRules,
                        maxTextLength: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Allowed Image Formats</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {customizationRules.allowedImageFormats.map((format) => (
                    <Badge key={format} variant="outline">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button>Save Pricing Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fonts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Font Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">Manage available fonts for text customization</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Font
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Font Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Additional Cost (₹)</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fontOptions.map((font) => (
                    <TableRow key={font.name}>
                      <TableCell className="font-medium">{font.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{font.category}</Badge>
                      </TableCell>
                      <TableCell>₹{font.cost}</TableCell>
                      <TableCell>
                        <span style={{ fontFamily: font.name }}>Sample Text</span>
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

        <TabsContent value="print-areas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Print Area Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Available Print Positions</h3>
                  <div className="space-y-2">
                    {customizationRules.printPositions.map((position) => (
                      <div key={position} className="flex items-center justify-between p-2 border rounded">
                        <span>{position}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Print Area Specifications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Area</TableHead>
                        <TableHead>Size (px)</TableHead>
                        <TableHead>Position</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {printAreas.map((area) => (
                        <TableRow key={area.name}>
                          <TableCell>{area.name}</TableCell>
                          <TableCell>
                            {area.width} × {area.height}
                          </TableCell>
                          <TableCell>
                            ({area.x}, {area.y})
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Guidelines & Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="designGuidelines">Design Guidelines</Label>
                <Textarea
                  id="designGuidelines"
                  placeholder="Enter design guidelines for customers..."
                  rows={4}
                  defaultValue="• Images should be high resolution (minimum 300 DPI)
• Avoid copyrighted logos or images
• Text should be readable and not too small
• Dark colors work best on light t-shirts and vice versa"
                />
              </div>
              <div>
                <Label htmlFor="restrictedContent">Restricted Content Policy</Label>
                <Textarea
                  id="restrictedContent"
                  placeholder="Define what content is not allowed..."
                  rows={4}
                  defaultValue="• No offensive, hateful, or inappropriate content
• No copyrighted material without permission
• No political or religious content
• No violent or disturbing imagery"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="manualReview" />
                <Label htmlFor="manualReview">Enable manual design review before production</Label>
              </div>
              <Button>Save Guidelines</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
