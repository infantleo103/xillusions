"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Shirt, Upload, Type } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CustomizeTshirtSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shirt className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold">Customize Your T-Shirt</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Design your perfect t-shirt with our advanced customization tools. Upload logos, add text, and create
            something uniquely yours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Preview Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center"
                alt="Custom T-Shirt Preview"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <p className="text-center font-semibold text-gray-800">Your Design Here</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <Shirt className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Choose Style</h3>
                  <p className="text-sm text-muted-foreground">Round Neck, Polo, V-Neck</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <Palette className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Pick Colors</h3>
                  <p className="text-sm text-muted-foreground">Multiple color options</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Upload Logo</h3>
                  <p className="text-sm text-muted-foreground">JPG, PNG, SVG support</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <Type className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Custom Text</h3>
                  <p className="text-sm text-muted-foreground">Upload fonts & style text</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-4">
              <Link href="/customize">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                  <Palette className="h-5 w-5 mr-2" />
                  Start Customizing
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">Free design tools • Live preview • Instant add to cart</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
