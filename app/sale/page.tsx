"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/models"
import { getProducts } from "@/lib/mock-data"

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const saleProducts = getProducts({ category: "sale" })
      setProducts(saleProducts)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading sale products...</p>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sale Items</h1>
          <p className="text-muted-foreground text-lg">
            Don't miss out on these amazing deals! Limited time offers on premium fashion items.
          </p>
        </div>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  )
}
