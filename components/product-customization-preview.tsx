"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Eye } from "lucide-react"
import Image from "next/image"

interface ProductPreviewProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    colors: string[]
  }
  onCustomize: (productId: string) => void
}

const colorMap: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  gray: "#6B7280",
  navy: "#1E3A8A",
}

export function ProductCustomizationPreview({ product, onCustomize }: ProductPreviewProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 transition-colors duration-300"
            style={{ backgroundColor: colorMap[selectedColor] || "#FFFFFF" }}
          />
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="relative z-10 w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          />
          <Badge className="absolute top-4 left-4 z-20 bg-purple-600 hover:bg-purple-700">Customizable</Badge>

          {isHovered && (
            <div className="absolute inset-0 z-30 bg-black/20 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100"
                onClick={() => onCustomize(product.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Customization
              </Button>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg mb-3">{product.name}</h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedColor(color)
                  }}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? "border-purple-500" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: colorMap[color] }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground self-center ml-1">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold">${product.price}</span>
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => onCustomize(product.id)}>
            <Palette className="h-4 w-4 mr-2" />
            Start Customizing
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
