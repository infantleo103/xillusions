"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"

// Define Product interface
export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  badge: string
  rating: number
  reviews: number
  featured: boolean
  productFor: "sale" | "customization"
}

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch featured products for sale only
        const response = await fetch('/api/products/featured?productFor=sale&limit=8')
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.data)
        } else {
          console.error('API returned error:', data.error)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      fetchFeaturedProducts()
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  const toggleFavorite = (productId: number) => {
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
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="bg-gray-200 animate-pulse h-64 md:h-80 w-full"></div>
                  <div className="p-4 md:p-6 space-y-3">
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
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 md:top-4 left-2 md:left-4 text-xs">{product.badge}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 md:top-4 right-2 md:right-4 bg-white/80 hover:bg-white h-8 w-8 md:h-10 md:w-10"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(product.id)
                    }}
                  >
                    <Heart
                      className={`h-3 w-3 md:h-4 md:w-4 ${
                        favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </Button>
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      className="w-full text-xs md:text-sm"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart(product)
                      }}
                    >
                      <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs md:text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg md:text-xl font-bold">${product.price}</span>
                    <span className="text-xs md:text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/men">
            <Button size="lg" variant="outline" className="px-6 md:px-8 text-sm md:text-base">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
