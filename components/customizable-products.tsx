"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Palette } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/models"

export function CustomizableProducts() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchCustomizableProducts = async () => {
      try {
        // Fetch products with category=custom and productFor=customization
        const response = await fetch('/api/products?category=custom&productFor=customization')
        const data = await response.json()
        
        if (data.success) {
          // Get only the first 3 products
          const customizableProducts = (data.data || []).slice(0, 3)
          setProducts(customizableProducts)
        } else {
          console.error('Failed to fetch customizable products:', data.error)
        }
      } catch (error) {
        console.error('Error fetching customizable products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCustomizableProducts()
  }, [])

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Palette className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Customizable Products</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Make it uniquely yours with our customizable products. Add your personal touch to create something
              special.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="bg-gray-200 animate-pulse h-80 w-full"></div>
                  <div className="p-6 space-y-3">
                    <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-6 w-1/3 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Customizable Products</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Make it uniquely yours with our customizable products. Add your personal touch to create something special.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-purple-500">Customizable</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(product.id)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </Button>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/customize?product=${product.id}`}>
                      <Button className="w-full">
                        <Palette className="h-4 w-4 mr-2" />
                        Customize Now
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.customOptions?.map((option) => (
                      <Badge key={option} variant="outline" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/customize">
            <Button size="lg" variant="outline" className="px-8">
              <Palette className="h-4 w-4 mr-2" />
              View All Customizable Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
