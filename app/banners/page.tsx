"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Hero } from "@/components/hero"

export default function BannersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Banner Slider Examples</h1>
      
      <Tabs defaultValue="slide" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="slide">Slide Banner</TabsTrigger>
          <TabsTrigger value="fade">Fade Banner</TabsTrigger>
          <TabsTrigger value="cube">Cube Banner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="slide" className="mt-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Slide Effect Banner</h2>
            <p className="text-gray-600 mb-4">
              This banner uses a horizontal sliding effect to transition between images.
              It automatically slides every second and pauses on hover.
            </p>
          </div>
          <Hero bannerType="slide" />
        </TabsContent>
        
        <TabsContent value="fade" className="mt-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Fade Effect Banner</h2>
            <p className="text-gray-600 mb-4">
              This banner uses a fade in/out effect to transition between images.
              It automatically transitions every second and pauses on hover.
            </p>
          </div>
          <Hero bannerType="fade" />
        </TabsContent>
        
        <TabsContent value="cube" className="mt-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">3D Cube Effect Banner</h2>
            <p className="text-gray-600 mb-4">
              This banner uses a 3D cube rotation effect to transition between images.
              It automatically rotates every second and pauses on hover.
            </p>
          </div>
          <Hero bannerType="cube" />
        </TabsContent>
      </Tabs>
    </div>
  )
}