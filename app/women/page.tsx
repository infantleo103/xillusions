"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/models"

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=women')
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.data || [])
        } else {
          console.error('Failed to fetch products:', data.error)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Women's Collection</h1>
          <p className="text-muted-foreground text-lg">
            Explore our curated women's fashion collection with elegant designs and premium materials.
          </p>
        </div>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  )
}
