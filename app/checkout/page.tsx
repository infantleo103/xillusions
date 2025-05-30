"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [upiId, setUpiId] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  // Ensure component is mounted before accessing cart state
  useEffect(() => {
    setMounted(true)

    // Pre-fill form with user data if logged in
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        address: "",
        city: "",
        state: "",
        zip: "",
      })
    }
  }, [user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      router.push("/login?redirect=/checkout")
    }
  }, [mounted, user, router])

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(state.total * 0.1)
    } else {
      setDiscount(0)
    }
  }

  const subtotal = state.total
  const tax = subtotal * 0.08
  const total = subtotal + tax - discount

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "mobile", "address", "city", "state", "zip"]
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }

    if (paymentMethod === "gpay" && !upiId) {
      alert("Please enter your UPI ID for GPay payment")
      return false
    }

    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setPaymentError("")

    try {
      // Prepare order data with customization details
      const orderData = {
        items: state.items.map((item) => {
          // Process customization data if it exists
          if (item.customization) {
            return {
              ...item,
              customization: {
                productId: item.customization.productId,
                elements: item.customization.elements.map(element => ({
                  id: element.id,
                  type: element.type,
                  content: element.content,
                  x: element.x,
                  y: element.y,
                  width: element.width,
                  height: element.height,
                  rotation: element.rotation,
                  fontSize: element.fontSize || null,
                  fontFamily: element.fontFamily || null,
                  color: element.color || null,
                  zIndex: element.zIndex,
                  side: element.side || 'front',
                  originalImageUrl: element.originalImageUrl || null
                })),
                frontPreviewImage: item.customization.frontPreviewImage || null,
                backPreviewImage: item.customization.backPreviewImage || null,
                previewImage: item.customization.previewImage || item.customization.frontPreviewImage || null,
                originalProductImage: item.customization.originalProductImage || item.image || null
              }
            };
          }
          return {
            ...item,
            customization: null
          };
        }),
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total: total,
        customerInfo: formData,
        paymentInfo: {
          method: paymentMethod === "cod" ? "Cash on Delivery" : "GPay",
          upiId: paymentMethod === "gpay" ? upiId : undefined,
          transactionId: `txn_${Date.now()}`,
        },
        promoCode: promoCode || undefined,
      }

      // Send order to the API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Clear cart
      dispatch({ type: "CLEAR_CART" })

      // Set order number and show success dialog
      setOrderNumber(data.order.orderNumber)
      setOrderCompleted(true)
    } catch (error) {
      console.error("Payment failed:", error)
      setPaymentError(error.message || 'An error occurred during payment processing. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }


  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <CheckCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">Please log in to your account to proceed with checkout.</p>
            <div className="space-y-3">
              <Link href="/login?redirect=/checkout">
                <Button className="w-full">Login to Continue</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full">
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {orderCompleted ? (
          // Order Completion Screen
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">Order Complete!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your purchase! Your order has been successfully placed and is being processed.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <p className="text-sm text-muted-foreground">Order Number: {orderNumber}</p>
                    <p className="text-sm text-muted-foreground">Order Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Status: Confirmed</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Method: {paymentMethod === "cod" ? "Cash on Delivery" : "GPay"}
                    </p>
                    <p className="text-sm text-muted-foreground">Total: ${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {paymentMethod === "cod"
                    ? "You will pay cash when your order is delivered."
                    : "Payment confirmation will be sent to your email."}
                </p>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: 3-5 business days
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button onClick={() => router.push("/")}>
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  View Order History
                </Button>
              </div>
            </div>
          </div>
        ) : state.items.length === 0 ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button onClick={() => router.push("/")}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <CheckCircle className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code *</Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          value={formData.zip}
                          onChange={(e) => handleInputChange("zip", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <CheckCircle className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Payment Method *</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2 space-y-3">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label
                            htmlFor="cod"
                            className="flex items-center gap-2 cursor-pointer flex-1 text-sm md:text-base"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Cash on Delivery
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="gpay" id="gpay" />
                          <Label
                            htmlFor="gpay"
                            className="flex items-center gap-2 cursor-pointer flex-1 text-sm md:text-base"
                          >
                            <CheckCircle className="h-4 w-4" />
                            GPay (UPI)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "gpay" && (
                      <div className="mt-4">
                        <Label htmlFor="upiId">UPI ID *</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter your UPI ID (e.g., yourname@paytm, yourname@phonepe)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardContent className="p-4 md:p-6">
                    {state.items.map((item) => (
                      <div key={item.id} className="space-y-3">
                        <div className="flex gap-3">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                              {item.color && ` • Color: ${item.color}`}
                            </p>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Show customization details if present */}
                        {item.customization && (
                          <div className="ml-16 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <h5 className="font-medium text-blue-800 mb-2">Customization Details:</h5>
                            <div className="space-y-1 text-sm text-blue-700">
                              <p>
                                <strong>Side:</strong> {item.customization.side}
                              </p>
                              {item.customization.elements && item.customization.elements.length > 0 && (
                                <div>
                                  <strong>Design Elements:</strong>
                                  <ul className="list-disc list-inside ml-2">
                                    {item.customization.elements.map((element: any, index: number) => (
                                      <li key={index}>
                                        {element.type === "text" ? `Text: "${element.content}"` : "Custom Image"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {item.customization.previewImage && (
                                <p>
                                  <strong>Preview:</strong> Custom design applied
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <Separator />

                    {/* Promo Code */}
                    <div className="space-y-2">
                      <Label htmlFor="promoCode">Promo Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="promoCode"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={applyPromoCode}>
                          Apply
                        </Button>
                      </div>
                      {discount > 0 && (
                        <p className="text-sm text-green-600">Promo code applied! You saved ${discount.toFixed(2)}</p>
                      )}
                    </div>

                    <Separator />
                    
                    {paymentError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                        <p className="font-medium">Payment Error</p>
                        <p className="text-sm">{paymentError}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full" onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </div>
                      ) : (
                        `Place Order - $${total.toFixed(2)}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
