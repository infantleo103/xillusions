"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/models"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [authChecking, setAuthChecking] = useState(true)

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  })

  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login?redirect=/admin/categories')
      } else if (user.role !== 'admin') {
        // Not an admin, redirect to home
        router.push('/')
      } else {
        setAuthChecking(false)
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authChecking) {
      fetchCategories()
    }
  }, [search, authChecking])

  const fetchCategories = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Build query string
      const queryParams = new URLSearchParams()
      if (search) queryParams.append('search', search)
      
      // Fetch categories from API
      const response = await fetch(`/api/categories?${queryParams.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      } else {
        setError(data.error || 'Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('An error occurred while fetching categories')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/toggle-status`, {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update the category in the local state
        setCategories(
          categories.map((category) =>
            category.id === categoryId ? { ...category, status: data.status, updatedAt: new Date() } : category,
          ),
        )
      } else {
        setError(data.error || 'Failed to update category status')
      }
    } catch (error) {
      console.error('Error toggling category status:', error)
      setError('An error occurred while updating category status')
    }
  }

  const handleSubmitCategory = async () => {
    // Validate form
    if (!categoryForm.name.trim()) {
      setError("Category name is required")
      return
    }
    
    if (!categoryForm.slug.trim()) {
      setError("Slug is required")
      return
    }
    
    setError("")
    setSubmitting(true)
    
    try {
      if (isEditing && selectedCategory) {
        // Update existing category
        const response = await fetch(`/api/categories/${selectedCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryForm),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Update the category in the local state
          setCategories(
            categories.map((category) =>
              category.id === selectedCategory.id
                ? {
                    ...category,
                    name: categoryForm.name,
                    slug: categoryForm.slug,
                    description: categoryForm.description,
                    image: categoryForm.image,
                    updatedAt: new Date(),
                  }
                : category,
            ),
          )
        } else {
          setError(data.error || 'Failed to update category')
          return
        }
      } else {
        // Create new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryForm),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Add the new category to the local state
          setCategories([...categories, data.data])
        } else {
          setError(data.error || 'Failed to create category')
          return
        }
      }
      
      // Close dialog and reset form on success
      setShowCategoryDialog(false)
      resetForm()
      
    } catch (error) {
      console.error('Error saving category:', error)
      setError('An error occurred while saving the category')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    setDeleting(true)
    setError("")
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Remove the category from the local state
        setCategories(categories.filter((category) => category.id !== categoryId))
        setShowDeleteDialog(false)
        setSelectedCategory(null)
      } else {
        setError(data.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('An error occurred while deleting the category')
    } finally {
      setDeleting(false)
    }
  }

  const resetForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      image: "",
    })
    setSelectedCategory(null)
    setIsEditing(false)
  }

  const openEditDialog = (category: Category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
    })
    setSelectedCategory(category)
    setIsEditing(true)
    setShowCategoryDialog(true)
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }

  // Handle name change and auto-generate slug if not in edit mode
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCategoryForm({
      ...categoryForm,
      name,
      // Only auto-generate slug if creating a new category or slug hasn't been manually edited
      slug: !isEditing ? generateSlug(name) : categoryForm.slug,
    });
  }

  // Show loading state while checking authentication
  if (authChecking) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Button
          onClick={() => {
            resetForm()
            setShowCategoryDialog(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading categories...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found. Create your first category!
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={category.status === "active" ? "default" : "secondary"}>
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleCategoryStatus(category.id)}
                            title={category.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {category.status === "active" ? (
                              <ToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCategory(category)
                              setShowDeleteDialog(true)
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={categoryForm.name}
                onChange={handleNameChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={categoryForm.image}
                onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCategory} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Create"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedCategory && deleteCategory(selectedCategory.id)}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}