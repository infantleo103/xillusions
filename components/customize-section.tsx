"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/models"

export function CustomizeSection() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchCustomizableProducts = async () => {
      try {
        // Initialize database first
        await fetch("/api/init-db", { method: "POST" })

        const response = await fetch("/api/products?customizable=true")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        if (Array.isArray(data)) {
          setProducts(data.slice(0, 3)) // Show only first 3
        } else {
          console.error("Invalid data format:", data)
          setProducts([])
        }
      } catch (error) {
        console.error("Error fetching customizable products:", error)
        setProducts([])
      }
    }

    fetchCustomizableProducts()
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

  return null
}
