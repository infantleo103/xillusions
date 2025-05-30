"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, Upload, Eye, ShoppingCart, Trash2, Plus, Move } from "lucide-react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/models"
import { toast, Toaster } from "react-hot-toast"
import { uploadImage, uploadMultipleImages } from "@/lib/utils/image-upload"

interface DesignElement {
  id: string
  type: "text" | "image"
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fontSize?: number
  fontFamily?: string
  color?: string
  side: "front" | "back"
}

export default function CustomizePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { dispatch } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [designElements, setDesignElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Text controls
  const [textInput, setTextInput] = useState("")
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState("Arial")
  const [textColor, setTextColor] = useState("#000000")

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productId = searchParams.get("product")

        if (productId) {
          // Fetch a specific product
          const response = await fetch(`/api/products/${productId}`)
          const data = await response.json()
          
          if (data.success && data.data) {
            setSelectedProduct(data.data)
          } else {
            console.error('Failed to fetch product:', data.error)
          }
        } else {
          // Fetch all customizable products
          const response = await fetch('/api/products?customizable=true')
          const data = await response.json()
          
          if (data.success) {
            setProducts(data.data || [])
          } else {
            console.error('Failed to fetch products:', data.error)
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [searchParams])

  const productSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const productColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Navy", value: "#1E3A8A" },
    { name: "Red", value: "#DC2626" },
    { name: "Green", value: "#059669" },
    { name: "Purple", value: "#7C3AED" },
  ]

  const addTextElement = () => {
    if (!textInput.trim()) return

    // Get canvas dimensions for centered positioning
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    const canvasWidth = canvasRect?.width || 400
    const canvasHeight = canvasRect?.height || 500
    
    const elementWidth = 200
    const elementHeight = 50
    
    const newElement: DesignElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: textInput,
      x: (canvasWidth - elementWidth) / 2, // Center horizontally
      y: canvasHeight / 3, // Position at 1/3 from the top
      width: elementWidth,
      height: elementHeight,
      rotation: 0,
      fontSize,
      fontFamily,
      color: textColor,
      side: currentSide,
    }

    setDesignElements([...designElements, newElement])
    setTextInput("")
  }

  const addImageElement = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // Get canvas dimensions for centered positioning
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      const canvasWidth = canvasRect?.width || 400
      const canvasHeight = canvasRect?.height || 500
      
      const elementWidth = 150
      const elementHeight = 150
      
      const newElement: DesignElement = {
        id: `image-${Date.now()}`,
        type: "image",
        content: e.target?.result as string,
        x: (canvasWidth - elementWidth) / 2, // Center horizontally
        y: canvasHeight / 2, // Position at middle
        width: elementWidth,
        height: elementHeight,
        rotation: 0,
        side: currentSide,
      }

      setDesignElements([...designElements, newElement])
    }
    reader.readAsDataURL(file)
  }

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setDesignElements((elements) => elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = (id: string) => {
    setDesignElements((elements) => elements.filter((el) => el.id !== id))
    setSelectedElement(null)
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.preventDefault()
      setSelectedElement(elementId)
      setIsDragging(true)

      const element = designElements.find((el) => el.id === elementId)
      if (element) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          setDragOffset({
            x: e.clientX - rect.left - element.x,
            y: e.clientY - rect.top - element.y,
          })
        }
      }
    },
    [designElements],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedElement) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const newX = e.clientX - rect.left - dragOffset.x
        const newY = e.clientY - rect.top - dragOffset.y

        // Find the current element to get its dimensions
        const currentElement = designElements.find(el => el.id === selectedElement)
        if (!currentElement) return
        
        // Keep element within canvas bounds, accounting for element width and height
        const maxX = rect.width - currentElement.width
        const maxY = rect.height - currentElement.height

        setDesignElements((elements) =>
          elements.map((el) =>
            el.id === selectedElement
              ? { ...el, x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) }
              : el,
          ),
        )
      }
    },
    [isDragging, selectedElement, dragOffset],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Direct add to cart without customization (for testing)
  const addToCartSimple = () => {
    if (!selectedProduct || !selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    try {
      // Add simple item to cart
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          size: selectedSize,
          color: selectedColor,
        },
      });

      toast.success("Item added to cart successfully!");
      router.push("/cart");
    } catch (error) {
      console.error("Error adding simple item to cart:", error);
      toast.error("There was an error adding the item to your cart. Please try again.");
    }
  };

  // Function to capture preview image from a DOM element
  const capturePreviewImage = async (elementRef, side) => {
    if (!elementRef.current) return null;
    
    try {
      // Use html2canvas to capture the preview
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(elementRef.current, {
        useCORS: true, // Allow cross-origin images
        scale: 2, // Higher quality
        logging: false,
        backgroundColor: null
      });
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      console.log(`Captured ${side} preview image`);
      return dataUrl;
    } catch (error) {
      console.error(`Error capturing ${side} preview:`, error);
      return null;
    }
  };

  // Create refs for front and back preview elements
  const frontPreviewRef = useRef(null);
  const backPreviewRef = useRef(null);

  // Simplified Add to Cart function
  const addToCart = async () => {
    if (!selectedProduct || !selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }

    try {
      // Create a simple cart item without customization if no design elements
      if (designElements.length === 0) {
        dispatch({
          type: "ADD_ITEM",
          payload: {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            size: selectedSize,
            color: selectedColor,
          },
        });
      } else {
        // Show loading message
        const loadingToast = toast.loading("Preparing your customized product...");
        
        try {
          // Step 1: Upload any image elements to Cloudinary
          const imageUploadPromises = [];
          const imageElements = designElements.filter(el => el.type === "image");
          
          // Prepare image elements for upload
          for (const element of imageElements) {
            // Only upload if it's a data URL (base64), not an already uploaded image
            if (element.content.startsWith('data:')) {
              imageUploadPromises.push(
                uploadImage(element.content, 'customization-elements')
                  .then(result => ({ elementId: element.id, result }))
              );
            }
          }
          
          // Wait for all image uploads to complete
          const uploadedImages = await Promise.all(imageUploadPromises);
          
          // Create a map of element IDs to uploaded image URLs
          const uploadedImageMap = {};
          for (const { elementId, result } of uploadedImages) {
            if (result.success) {
              uploadedImageMap[elementId] = result.url;
            }
          }
          
          // Format the design elements with uploaded image URLs
          const formattedElements = designElements.map((el, index) => {
            // For image elements, use the uploaded URL if available
            let content = el.content;
            let originalImageUrl = undefined;
            
            if (el.type === "image") {
              // Store the original image URL
              originalImageUrl = el.content;
              
              // If we have an uploaded version, use that for content
              if (uploadedImageMap[el.id]) {
                content = uploadedImageMap[el.id];
              }
            }
            
            return {
              id: el.id,
              type: el.type === "image" ? "logo" : "text",
              content: content,
              x: el.x,
              y: el.y,
              width: el.width,
              height: el.height,
              rotation: el.rotation,
              fontSize: el.fontSize,
              fontFamily: el.fontFamily,
              color: el.color,
              zIndex: index + 1,
              side: el.side,
              originalImageUrl
            };
          });

          // Step 2: Capture preview images
          // We need to make sure the preview dialog is open to capture images
          if (!showPreview) {
            setShowPreview(true);
            // Wait for the dialog to render
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Capture front and back preview images
          const frontPreviewImageData = await capturePreviewImage(frontPreviewRef, 'front');
          const backPreviewImageData = await capturePreviewImage(backPreviewRef, 'back');
          
          // Step 3: Upload preview images to Cloudinary
          toast.loading("Uploading preview images...", { id: loadingToast });
          
          const previewUploads = [];
          if (frontPreviewImageData) {
            previewUploads.push(uploadImage(frontPreviewImageData, 'customization-previews', `front_${Date.now()}`));
          }
          if (backPreviewImageData) {
            previewUploads.push(uploadImage(backPreviewImageData, 'customization-previews', `back_${Date.now()}`));
          }
          
          const [frontPreviewResult, backPreviewResult] = await Promise.all(previewUploads);
          
          // Get the uploaded preview image URLs
          const frontPreviewImage = frontPreviewResult?.success ? frontPreviewResult.url : null;
          const backPreviewImage = backPreviewResult?.success ? backPreviewResult.url : null;
          
          // Create customization object with uploaded preview images
          const customization = {
            productId: selectedProduct.id,
            elements: formattedElements,
            frontPreviewImage,
            backPreviewImage,
            previewImage: frontPreviewImage, // Use front as the main preview
            originalProductImage: selectedProduct.image
          };

          // Add customized item to cart
          dispatch({
            type: "ADD_ITEM",
            payload: {
              id: selectedProduct.id,
              name: `${selectedProduct.name} (Custom)`,
              price: selectedProduct.price,
              image: selectedProduct.image,
              size: selectedSize,
              color: selectedColor,
              customization,
            },
          });
          
          // Dismiss loading toast and show success
          toast.dismiss(loadingToast);
          toast.success("Customized item added to cart!");
          
          // Navigate to cart page
          router.push("/cart");
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          toast.dismiss(loadingToast);
          toast.error("Error uploading images. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("There was an error adding the item to your cart. Please try again.");
    }
  }

  const getCurrentImage = () => {
    if (!selectedProduct) return "/placeholder.svg"

    if (currentSide === "front") {
      return selectedProduct.frontImage || selectedProduct.image
    } else {
      return selectedProduct.backImage || selectedProduct.image
    }
  }
  
  // Function to scale coordinates from design canvas to preview
  const scaleCoordinates = (element, previewHeight = 384, previewWidth = 448) => { 
    // 384px is h-96, 448px is max-w-md (28rem)
    // Get the current canvas dimensions
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return element;
    
    const canvasHeight = canvasRect.height;
    const canvasWidth = canvasRect.width;
    
    // Calculate the scale factors
    const scaleY = previewHeight / canvasHeight;
    const scaleX = previewWidth / canvasWidth;
    
    // Use the smaller scale factor to ensure the entire design fits
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate the offset to center the design
    const offsetX = (previewWidth - (canvasWidth * scale)) / 2;
    const offsetY = (previewHeight - (canvasHeight * scale)) / 2;
    
    // Scale the coordinates and dimensions
    return {
      ...element,
      x: (element.x * scale) + offsetX,
      y: (element.y * scale) + offsetY,
      width: element.width * scale,
      height: element.height * scale,
      fontSize: element.fontSize ? element.fontSize * scale : undefined
    };
  }

  const currentSideElements = designElements.filter((el) => el.side === currentSide)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading customization tools...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Product selection page
  if (!selectedProduct) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Customize Your Product</h1>
            
          </div>
          <ProductGrid products={products} />
        </main>
        <Footer />
      </div>
    )
  }

  // Customization interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Toast notifications */}
      <Toaster position="top-center" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back to Products
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Design Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-2xl font-bold text-primary">${selectedProduct.price}</p>
                </div>

                <div>
                  <Label>Size *</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {productSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Quick Add to Cart buttons */}
                {selectedSize && (
                  <div className="mt-4 space-y-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={addToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart with Design
                    </Button>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={addToCartSimple}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart (No Design)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Add Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Text</Label>
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text"
                  />
                </div>

                <div>
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={12}
                    max={72}
                    step={2}
                  />
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                </div>

                <Button onClick={addTextElement} className="w-full" disabled={!textInput.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Text to {currentSide}
                </Button>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) addImageElement(file)
                  }}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image to {currentSide}
                </Button>
              </CardContent>
            </Card>

            {/* Design Elements */}
            {currentSideElements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Design Elements ({currentSide})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentSideElements.map((element) => (
                      <div
                        key={element.id}
                        className={`p-2 border rounded cursor-pointer ${
                          selectedElement === element.id ? "border-primary bg-primary/10" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm flex items-center gap-2">
                            <Move className="h-3 w-3" />
                            {element.type === "text" ? element.content : "Image"}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteElement(element.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Design Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(true)}
                      disabled={designElements.length === 0}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      onClick={addToCart} 
                      disabled={!selectedSize} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Front/Back Tabs */}
                <Tabs
                  value={currentSide}
                  onValueChange={(value) => setCurrentSide(value as "front" | "back")}
                  className="mb-4"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="front">Front View</TabsTrigger>
                    <TabsTrigger value="back">Back View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="front" className="mt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Designing the front side of your {selectedProduct.name.toLowerCase()}
                    </div>
                  </TabsContent>

                  <TabsContent value="back" className="mt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Designing the back side of your {selectedProduct.name.toLowerCase()}
                    </div>
                  </TabsContent>
                </Tabs>

                <div
                  ref={canvasRef}
                  className="relative w-full max-w-md mx-auto h-[500px] border-2 rounded-lg overflow-hidden cursor-crosshair"
                  style={{ 
                    backgroundColor: selectedColor === "#FFFFFF" ? "#F3F4F6" : selectedColor,
                    position: 'relative',
                    width:'auto'
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Debug grid overlay */}
                  {debugMode && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="border border-dashed border-blue-300 opacity-30 flex items-center justify-center">
                            <span className="text-xs text-blue-500 font-bold">{i+1}</span>
                          </div>
                        ))}
                      </div>
                      {/* Center marker */}
                      <div className="absolute" style={{ 
                        left: '50%', 
                        top: '50%', 
                        width: '20px', 
                        height: '20px', 
                        marginLeft: '-10px', 
                        marginTop: '-10px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                      {/* Crosshair */}
                      <div className="absolute" style={{ 
                        left: '0', 
                        top: '50%', 
                        width: '100%', 
                        height: '1px', 
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                      <div className="absolute" style={{ 
                        left: '50%', 
                        top: '0', 
                        width: '1px', 
                        height: '100%', 
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                    </div>
                  )}
                  
                  {/* Product Background */}
                  <Image
                    src={getCurrentImage() || "/placeholder.svg"}
                    alt={`${selectedProduct.name} ${currentSide}`}
                    fill
                    className="object-contain"
                  />

                  {/* Design Elements for Current Side */}
                  {currentSideElements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move border-2 ${
                        selectedElement === element.id ? "border-primary border-dashed" : "border-transparent"
                      } hover:border-gray-400 transition-colors z-10`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        transform: `rotate(${element.rotation}deg)`,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                    >
                      {element.type === "text" ? (
                        <div
                          style={{
                            fontSize: element.fontSize,
                            fontFamily: element.fontFamily,
                            color: element.color,
                            width: "auto",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            userSelect: "none",
                            pointerEvents: "none",
                          }}
                        >
                          {element.content}
                        </div>
                      ) : (
                        <div className="w-auto h-full flex items-center justify-center">
                          <img
                            src={element.content || "/placeholder.svg"}
                            alt="Custom"
                            className="max-w-full max-h-full object-contain pointer-events-none"
                            style={{  maxHeight: '100%' }}
                            draggable={false}
                          />
                        </div>
                      )}

                      {selectedElement === element.id && (
                        <>
                          {/* Resize handle */}
                          <div 
                            className="absolute -bottom-2 -right-2 w-5 h-5 bg-primary rounded-full border-2 border-white cursor-se-resize"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const startWidth = element.width;
                              const startHeight = element.height;
                              
                              const handleMouseMove = (moveEvent) => {
                                const deltaX = moveEvent.clientX - startX;
                                const deltaY = moveEvent.clientY - startY;
                                
                                // Maintain aspect ratio for images
                                let newWidth = Math.max(30, startWidth + deltaX);
                                let newHeight = element.type === 'image' 
                                  ? (newWidth / startWidth) * startHeight 
                                  : Math.max(30, startHeight + deltaY);
                                
                                updateElement(element.id, {
                                  width: newWidth,
                                  height: newHeight
                                });
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          />
                          
                          {/* Selection indicator */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                        </>
                      )}
                    </div>
                  ))}

                  {currentSideElements.length === 0 && (
                    <div className="absolute  flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Palette className="h-12 w-12 mx-auto mb-4" />
                        <p>Add text or images to customize</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Element Controls */}
                {selectedElement && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Element Controls</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const element = designElements.find(el => el.id === selectedElement);
                            if (element) {
                              // Center the element on the canvas
                              const canvasRect = canvasRef.current?.getBoundingClientRect();
                              if (canvasRect) {
                                const centerX = (canvasRect.width - element.width) / 2;
                                const centerY = (canvasRect.height - element.height) / 2;
                                updateElement(selectedElement, { x: centerX, y: centerY });
                              }
                            }
                          }}
                        >
                          <Move className="h-4 w-4 mr-1" />
                          Center
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteElement(selectedElement)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Width</Label>
                        <Slider
                          value={[designElements.find((el) => el.id === selectedElement)?.width || 100]}
                          onValueChange={(value) => updateElement(selectedElement, { width: value[0] })}
                          min={50}
                          max={300}
                        />
                      </div>
                      <div>
                        <Label>Height</Label>
                        <Slider
                          value={[designElements.find((el) => el.id === selectedElement)?.height || 100]}
                          onValueChange={(value) => updateElement(selectedElement, { height: value[0] })}
                          min={30}
                          max={200}
                        />
                      </div>
                      <div>
                        <Label>Rotation</Label>
                        <Slider
                          value={[designElements.find((el) => el.id === selectedElement)?.rotation || 0]}
                          onValueChange={(value) => updateElement(selectedElement, { rotation: value[0] })}
                          min={-180}
                          max={180}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Debug Mode Toggle */}
                {process.env.NODE_ENV !== 'production' && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => setDebugMode(!debugMode)}
                    >
                      {debugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
                    </Button>
                    
                    {debugMode && (
                      <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                        <p>Canvas Size: {canvasRef.current?.clientWidth}x{canvasRef.current?.clientHeight}</p>
                        <p>Preview Size: 448x384 (max-w-md x h-96)</p>
                        <p>Scale X: {canvasRef.current ? (448 / canvasRef.current.clientWidth).toFixed(2) : 'N/A'}</p>
                        <p>Scale Y: {canvasRef.current ? (384 / canvasRef.current.clientHeight).toFixed(2) : 'N/A'}</p>
                        <p>Used Scale: {canvasRef.current ? 
                          Math.min(
                            448 / canvasRef.current.clientWidth, 
                            384 / canvasRef.current.clientHeight
                          ).toFixed(2) : 'N/A'}</p>
                        <p>Elements: {designElements.length}</p>
                        {selectedElement && (
                          <>
                            <p>Selected: {selectedElement}</p>
                            <pre>{JSON.stringify(designElements.find(el => el.id === selectedElement), null, 2)}</pre>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  {currentSideElements.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        // Get canvas dimensions
                        const canvasRect = canvasRef.current?.getBoundingClientRect();
                        if (!canvasRect) return;
                        
                        const centerX = canvasRect.width / 2;
                        const centerY = canvasRect.height / 2;
                        
                        // Center all elements for the current side
                        setDesignElements(prev => 
                          prev.map(el => {
                            if (el.side !== currentSide) return el;
                            
                            return {
                              ...el,
                              x: centerX - (el.width / 2),
                              y: centerY - (el.height / 2)
                            };
                          })
                        );
                      }}
                    >
                      <Move className="h-4 w-4 mr-2" />
                      Center All Elements
                    </Button>
                  )}
                  
                  <Button size="lg" className="w-full" onClick={() => setShowPreview(true)}>
                    <Eye className="h-5 w-5 mr-2" />
                    Preview Design
                  </Button>
                  
                  {selectedSize && (
                    <Button 
                      variant="default" 
                      className="w-full" 
                      onClick={addToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart Directly
                    </Button>
                  )}
                  
                  {/* Debug button - only visible in development */}
                  {process.env.NODE_ENV !== 'production' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => {
                        // Use the state from the already initialized useCart hook
                        console.log("Current cart state:", state);
                        alert("Check console for cart state");
                      }}
                    >
                      Debug: Show Cart State
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Fixed Add to Cart button at bottom */}
      {selectedSize && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="font-semibold">{selectedProduct.name}</p>
              <p className="text-sm">Size: {selectedSize}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={addToCartSimple}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Quick Add - ${selectedProduct.price}
              </Button>
              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={addToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add with Design
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Design Preview</DialogTitle>
            
            {/* Top Add to Cart buttons for easier access */}
            {selectedSize && (
              <div className="flex gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={addToCartSimple}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={addToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add with Design
                </Button>
              </div>
            )}
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
              <p className="text-lg">Size: {selectedSize}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span>Color:</span>
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: selectedColor }} />
              </div>
            </div>

            <Tabs defaultValue="front" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="front">Front View</TabsTrigger>
                <TabsTrigger value="back">Back View</TabsTrigger>
              </TabsList>

              <TabsContent value="front">
                <div 
                  ref={frontPreviewRef}
                  className="relative w-full max-w-md h-96 border rounded-lg overflow-hidden mx-auto"
                >
                  {/* Debug grid overlay */}
                  {debugMode && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="border border-dashed border-red-300 opacity-30 flex items-center justify-center">
                            <span className="text-xs text-red-500 font-bold">{i+1}</span>
                          </div>
                        ))}
                      </div>
                      {/* Center marker */}
                      <div className="absolute" style={{ 
                        left: '50%', 
                        top: '50%', 
                        width: '20px', 
                        height: '20px', 
                        marginLeft: '-10px', 
                        marginTop: '-10px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                      {/* Crosshair */}
                      <div className="absolute" style={{ 
                        left: '0', 
                        top: '50%', 
                        width: '100%', 
                        height: '1px', 
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                      <div className="absolute" style={{ 
                        left: '50%', 
                        top: '0', 
                        width: '1px', 
                        height: '100%', 
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                    </div>
                  )}
                  <Image
                    src={selectedProduct.frontImage || selectedProduct.image}
                    alt={`${selectedProduct.name} front`}
                    fill
                    className="object-contain"
                  />
                  {designElements
                    .filter((el) => el.side === "front")
                    .map((element) => {
                      // Scale the element for the preview
                      const scaledElement = scaleCoordinates(element);
                      return (
                        <div
                          key={element.id}
                          className="absolute"
                          style={{
                            left: scaledElement.x,
                            top: scaledElement.y,
                            width: scaledElement.width,
                            height: scaledElement.height,
                            transform: `rotate(${element.rotation}deg)`,
                          }}
                        >
                          {element.type === "text" ? (
                            <div
                              style={{
                                fontSize: scaledElement.fontSize,
                                fontFamily: element.fontFamily,
                                color: element.color,
                                width: "auto",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                userSelect: "none",
                              }}
                            >
                              {element.content}
                            </div>
                          ) : (
                            <div className="w-auto h-full flex items-center justify-center">
                              <img
                                src={element.content || "/placeholder.svg"}
                                alt="Custom"
                                className=" max-h-full object-contain"
                                style={{maxHeight: '100%' }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </TabsContent>

              <TabsContent value="back">
                <div 
                  ref={backPreviewRef}
                  className="relative w-full max-w-md h-96 border rounded-lg overflow-hidden mx-auto"
                >
                  {/* Debug grid overlay */}
                  {debugMode && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="border border-dashed border-red-300 opacity-30 flex items-center justify-center">
                            <span className="text-xs text-red-500 font-bold">{i+1}</span>
                          </div>
                        ))}
                      </div>
                      {/* Center marker */}
                      <div className="absolute" style={{ 
                        left: '50%', 
                        top: '50%', 
                        width: '20px', 
                        height: '20px', 
                        marginLeft: '-10px', 
                        marginTop: '-10px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                      {/* Crosshair */}
                      <div className="absolute" style={{ 
                        left: '0', 
                        top: '50%', 
                        width: '100%', 
                        height: '1px', 
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                      <div className="absolute" style={{ 
                        left: '50%', 
                        top: '0', 
                        width: '1px', 
                        height: '100%', 
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        zIndex: 20
                      }}></div>
                    </div>
                  )}
                  <Image
                    src={selectedProduct.backImage || selectedProduct.image}
                    alt={`${selectedProduct.name} back`}
                    fill
                    className="object-contain"
                  />
                  {designElements
                    .filter((el) => el.side === "back")
                    .map((element) => {
                      // Scale the element for the preview
                      const scaledElement = scaleCoordinates(element);
                      return (
                        <div
                          key={element.id}
                          className="absolute"
                          style={{
                            left: scaledElement.x,
                            top: scaledElement.y,
                            width: scaledElement.width,
                            height: scaledElement.height,
                            transform: `rotate(${element.rotation}deg)`,
                          }}
                        >
                          {element.type === "text" ? (
                            <div
                              style={{
                                fontSize: scaledElement.fontSize,
                                fontFamily: element.fontFamily,
                                color: element.color,
                                width: "auto",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                userSelect: "none",
                              }}
                            >
                              {element.content}
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={element.content || "/placeholder.svg"}
                                alt="Custom"
                                className="max-w-full max-h-full object-contain"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </TabsContent>
            </Tabs>

            {/* Debug information in preview */}
            {debugMode && (
              <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                <p>Canvas Size: {canvasRef.current?.clientWidth}x{canvasRef.current?.clientHeight}</p>
                <p>Preview Size: 448x384 (max-w-md x h-96)</p>
                <p>Scale X: {canvasRef.current ? (448 / canvasRef.current.clientWidth).toFixed(2) : 'N/A'}</p>
                <p>Scale Y: {canvasRef.current ? (384 / canvasRef.current.clientHeight).toFixed(2) : 'N/A'}</p>
                <p>Used Scale: {canvasRef.current ? 
                  Math.min(
                    448 / canvasRef.current.clientWidth, 
                    384 / canvasRef.current.clientHeight
                  ).toFixed(2) : 'N/A'}</p>
                <p>Offset X: {canvasRef.current ? 
                  ((448 - (canvasRef.current.clientWidth * Math.min(
                    448 / canvasRef.current.clientWidth, 
                    384 / canvasRef.current.clientHeight
                  ))) / 2).toFixed(2) : 'N/A'}</p>
                <p>Offset Y: {canvasRef.current ? 
                  ((384 - (canvasRef.current.clientHeight * Math.min(
                    448 / canvasRef.current.clientWidth, 
                    384 / canvasRef.current.clientHeight
                  ))) / 2).toFixed(2) : 'N/A'}</p>
                <p>Elements: {designElements.length}</p>
                <div className="mt-2">
                  <p>Front Elements:</p>
                  <pre>{JSON.stringify(designElements.filter(el => el.side === 'front').map(el => ({
                    id: el.id,
                    type: el.type,
                    x: el.x,
                    y: el.y,
                    width: el.width,
                    height: el.height,
                    scaled: scaleCoordinates(el)
                  })), null, 2)}</pre>
                </div>
                <div className="mt-2">
                  <p>Back Elements:</p>
                  <pre>{JSON.stringify(designElements.filter(el => el.side === 'back').map(el => ({
                    id: el.id,
                    type: el.type,
                    x: el.x,
                    y: el.y,
                    width: el.width,
                    height: el.height,
                    scaled: scaleCoordinates(el)
                  })), null, 2)}</pre>
                </div>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Continue Editing
              </Button>
              
              {/* Add to Cart buttons */}
              <div className="flex gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={addToCartSimple} 
                  disabled={!selectedSize}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={addToCart} 
                  disabled={!selectedSize}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add with Design
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
