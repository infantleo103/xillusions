"use client"

import { Button } from "@/components/ui/button"
import { X, Download, Share2 } from "lucide-react"

interface DesignElement {
  id: string
  type: "logo" | "text"
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fontSize?: number
  fontFamily?: string
  color?: string
  zIndex: number
}

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  designElements: DesignElement[]
  selectedColor: string
  selectedColorData: { name: string; hex: string } | undefined
  selectedSize: string
  currentProduct: any
  onAddToCart: () => void
}

export function DesignPreviewModal({
  isOpen,
  onClose,
  designElements,
  selectedColor,
  selectedColorData,
  selectedSize,
  currentProduct,
  onAddToCart,
}: DesignPreviewModalProps) {
  if (!isOpen) return null

  const downloadDesign = () => {
    // This would implement design download functionality
    console.log("Download design functionality would be implemented here")
  }

  const shareDesign = () => {
    // This would implement design sharing functionality
    console.log("Share design functionality would be implemented here")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Design Preview</h3>
            <Button variant="ghost" onClick={onClose} size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Canvas */}
            <div className="flex justify-center">
              <div
                className="relative bg-gray-100 rounded-lg overflow-hidden"
                style={{ width: "400px", height: "500px" }}
              >
                <div
                  className="absolute inset-4 rounded-lg shadow-lg"
                  style={{ backgroundColor: selectedColorData?.hex }}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    {designElements
                      .sort((a, b) => a.zIndex - b.zIndex)
                      .map((element) => (
                        <div
                          key={element.id}
                          className="absolute"
                          style={{
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            transform: `rotate(${element.rotation}deg)`,
                            zIndex: element.zIndex,
                          }}
                        >
                          {element.type === "logo" ? (
                            <img
                              src={element.content || "/placeholder.svg"}
                              alt="Logo"
                              className=" object-contain"
                            />
                          ) : (
                            <div
                              className=" flex items-center justify-center text-center break-words"
                              style={{
                                fontSize: element.fontSize,
                                fontFamily: element.fontFamily,
                                color: element.color,
                                lineHeight: "1.2",
                              }}
                            >
                              {element.content}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Product Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="font-medium">{currentProduct?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: selectedColorData?.hex }}
                      />
                      <span className="font-medium">{selectedColorData?.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{selectedSize || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-lg">${currentProduct?.price}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Design Elements</h4>
                <div className="space-y-2">
                  {designElements.length === 0 ? (
                    <p className="text-muted-foreground">No design elements added</p>
                  ) : (
                    designElements.map((element, index) => (
                      <div key={element.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {element.type === "logo" ? "Logo" : `Text: "${element.content}"`}
                        </span>
                        <span className="text-xs text-muted-foreground">Layer {index + 1}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={downloadDesign} variant="outline" className="w-full" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Download Design (Coming Soon)
                </Button>
                <Button onClick={shareDesign} variant="outline" className="w-full" disabled>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Design (Coming Soon)
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Editing
            </Button>
            <Button
              onClick={() => {
                onClose()
                onAddToCart()
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!selectedSize}
            >
              Add to Cart - ${currentProduct?.price}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
