"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useEffect } from "react"

export default function OrderConfirmationPage() {
  const { dispatch } = useCart()

  useEffect(() => {
    // Clear cart after successful order
    dispatch({ type: "CLEAR_CART" })
  }, [dispatch])

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <p className="text-sm text-muted-foreground">Order Number: {orderNumber}</p>
                  <p className="text-sm text-muted-foreground">Order Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Status: Paid</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <p className="text-sm text-muted-foreground">Estimated Delivery: 3-5 business days</p>
                  <p className="text-sm text-muted-foreground">Tracking information will be sent via email</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Receipt
            </Button>
          </div>

          <div className="mt-12">
            <p className="text-muted-foreground mb-4">Want to continue shopping?</p>
            <Link href="/">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
