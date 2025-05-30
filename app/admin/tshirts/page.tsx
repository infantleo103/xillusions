"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2, Eye, Upload } from "lucide-react"
import { ImageIcon } from "lucide-react"

interface TShirtProduct {
  id: number
  name: string
  description: string
  basePrice: number
  availableSizes: string[]
  baseColors: string[]
  frontTemplate: string
  backTemplate: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export default function TShirtManagementPage() {
  const [tshirts, setTshirts] = useState<TShirtProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showTshirtDialog, setShowTshirtDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTshirt, setSelectedTshirt] = useState<TShirtProduct | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [tshirtForm, setTshirtForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    frontTemplate: "",
    backTemplate: "",
  })

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]
  const availableColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Navy", value: "#1E3A8A" },
    { name: "Red", value: "#DC2626" },
    { name: "Green", value: "#059669" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Gray", value: "#6B7280" },
    { name: "Pink", value: "#EC4899" },
  ]

  // Mock data
  const mockTshirts: TShirtProduct[] = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      description: "Premium 100% cotton t-shirt perfect for customization",
      basePrice: 299,
      availableSizes: ["S", "M", "L", "XL"],
      baseColors: ["Black", "White", "Navy"],
      frontTemplate: "/placeholder.svg?height=400&width=400&query=tshirt+front",
      backTemplate: "/placeholder.svg?height=400&width=400&query=tshirt+back",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Premium Blend T-Shirt",
      description: "Cotton-polyester blend for durability and comfort",
      basePrice: 399,
      availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
      baseColors: ["Black", "White", "Gray", "Navy"],
      frontTemplate: "/placeholder.svg?height=400&width=400&query=premium+tshirt+front",
      backTemplate: "/placeholder.svg?height=400&width=400&query=premium+tshirt+back",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setTshirts(mockTshirts)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmitTshirt = () => {
    if (isEditing && selectedTshirt) {
      setTshirts(
        tshirts.map((tshirt) =>
          tshirt.id === selectedTshirt.id
            ? {
                ...tshirt,
                name: tshirtForm.name,
                description: tshirtForm.description,
                basePrice: Number.parseFloat(tshirtForm.basePrice),
                availableSizes: selectedSizes,
                baseColors: selectedColors,
                frontTemplate: tshirtForm.frontTemplate,
                backTemplate: tshirtForm.backTemplate,
                updatedAt: new Date(),
              }
            : tshirt,
        ),
      )
    } else {
      const newTshirt: TShirtProduct = {
        id: Math.max(...tshirts.map((t) => t.id)) + 1,
        name: tshirtForm.name,
        description: tshirtForm.description,
        basePrice: Number.parseFloat(tshirtForm.basePrice),
        availableSizes: selectedSizes,
        baseColors: selectedColors,
        frontTemplate: tshirtForm.frontTemplate,
        backTemplate: tshirtForm.backTemplate,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTshirts([...tshirts, newTshirt])
    }

    setShowTshirtDialog(false)
    resetForm()
  }

  const deleteTshirt = (tshirtId: number) => {
    setTshirts(tshirts.filter((tshirt) => tshirt.id !== tshirtId))
    setShowDeleteDialog(false)
    setSelectedTshirt(null)
  }

  const resetForm = () => {
    setTshirtForm({
      name: "",
      description: "",
      basePrice: "",
      frontTemplate: "",
      backTemplate: "",
    })
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedTshirt(null)
    setIsEditing(false)
  }

  const openEditDialog = (tshirt: TShirtProduct) => {
    setTshirtForm({
      name: tshirt.name,
      description: tshirt.description,
      basePrice: tshirt.basePrice.toString(),
      frontTemplate: tshirt.frontTemplate,
      backTemplate: tshirt.backTemplate,
    })
    setSelectedSizes(tshirt.availableSizes)
    setSelectedColors(tshirt.baseColors)
    setSelectedTshirt(tshirt)
    setIsEditing(true)
    setShowTshirtDialog(true)
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const filteredTshirts = tshirts.filter(
    (tshirt) =>
      tshirt.name.toLowerCase().includes(search.toLowerCase()) ||
      tshirt.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">T-Shirt Base Products Management</h1>
        <Button
          onClick={() => {
            resetForm()
            setShowTshirtDialog(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add T-Shirt Product
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search t-shirt products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* T-Shirts Table */}
      <Card>
        <CardHeader>
          <CardTitle>T-Shirt Products ({filteredTshirts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Templates</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Sizes</TableHead>
                  <TableHead>Colors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTshirts.map((tshirt) => (
                  <TableRow key={tshirt.id}>
                    <TableCell>
                      <div className="flex gap-2">
                        <ImageIcon
                          src={tshirt.frontTemplate || "/placeholder.svg"}
                          alt="Front template"
                          className="w-8 h-8 rounded object-cover"
                          title="Front template"
                        />
                        <ImageIcon
                          src={tshirt.backTemplate || "/placeholder.svg"}
                          alt="Back template"
                          className="w-8 h-8 rounded object-cover"
                          title="Back template"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tshirt.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{tshirt.description}</TableCell>
                    <TableCell>₹{tshirt.basePrice}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tshirt.availableSizes.map((size) => (
                          <Badge key={size} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tshirt.baseColors.slice(0, 3).map((color) => (
                          <div
                            key={color}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: availableColors.find((c) => c.name === color)?.value }}
                            title={color}
                          />
                        ))}
                        {tshirt.baseColors.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{tshirt.baseColors.length - 3}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tshirt.status === "active" ? "default" : "secondary"}>{tshirt.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(tshirt)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTshirt(tshirt)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* T-Shirt Dialog */}
      <Dialog open={showTshirtDialog} onOpenChange={setShowTshirtDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit T-Shirt Product" : "Add New T-Shirt Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={tshirtForm.name}
                  onChange={(e) => setTshirtForm({ ...tshirtForm, name: e.target.value })}
                  placeholder="e.g., Classic Cotton T-Shirt"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={tshirtForm.description}
                  onChange={(e) => setTshirtForm({ ...tshirtForm, description: e.target.value })}
                  placeholder="Describe the t-shirt material, fit, and features"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price (₹)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={tshirtForm.basePrice}
                  onChange={(e) => setTshirtForm({ ...tshirtForm, basePrice: e.target.value })}
                  placeholder="299"
                />
              </div>
              <div>
                <Label>Available Sizes</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleSize(size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Base Colors</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableColors.map((color) => (
                    <div key={color.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color.name}`}
                        checked={selectedColors.includes(color.name)}
                        onCheckedChange={() => toggleColor(color.name)}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.value }}
                      />
                      <Label htmlFor={`color-${color.name}`} className="text-sm">
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="frontTemplate">Front Template URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="frontTemplate"
                    value={tshirtForm.frontTemplate}
                    onChange={(e) => setTshirtForm({ ...tshirtForm, frontTemplate: e.target.value })}
                    placeholder="URL to front view mockup"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="backTemplate">Back Template URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="backTemplate"
                    value={tshirtForm.backTemplate}
                    onChange={(e) => setTshirtForm({ ...tshirtForm, backTemplate: e.target.value })}
                    placeholder="URL to back view mockup"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {(tshirtForm.frontTemplate || tshirtForm.backTemplate) && (
                <div>
                  <Label>Template Preview</Label>
                  <div className="flex gap-4 mt-2">
                    {tshirtForm.frontTemplate && (
                      <div className="text-center">
                        <ImageIcon
                          src={tshirtForm.frontTemplate || "/placeholder.svg"}
                          alt="Front template"
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Front</p>
                      </div>
                    )}
                    {tshirtForm.backTemplate && (
                      <div className="text-center">
                        <ImageIcon
                          src={tshirtForm.backTemplate || "/placeholder.svg"}
                          alt="Back template"
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Back</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTshirtDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTshirt}>{isEditing ? "Update" : "Create"} T-Shirt Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete T-Shirt Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTshirt?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => selectedTshirt && deleteTshirt(selectedTshirt.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
