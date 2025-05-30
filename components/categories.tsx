"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getCategories } from "@/lib/mock-data"
import type { Category } from "@/lib/models"

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const allCategories = getCategories()
      setCategories(allCategories)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Define category routes mapping
  const getCategoryRoute = (categorySlug: string) => {
    switch (categorySlug) {
      case "men":
        return "/men"
      case "women":
        return "/women"
      case "customize":
        return "/customize/products"
      case "new-arrivals":
        return "/new-arrivals"
      case "sale":
        return "/sale"
      default:
        return `/${categorySlug}`
    }
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Discover our carefully curated collections designed for every style and occasion
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="bg-gray-200 animate-pulse h-48 md:h-64 w-full"></div>
                  <div className="p-4">
                    <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 animate-pulse h-3 w-1/2 rounded"></div>
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
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections designed for every style and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link key={category.slug} href={getCategoryRoute(category.slug)}>
              <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={300}
                      className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <h3 className="text-lg md:text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-xs md:text-sm opacity-90 mb-4">{category.description}</p>
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black transition-colors text-xs md:text-sm"
                        >
                          {category.slug === "customize" ? "Start Customizing" : "Shop Now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
