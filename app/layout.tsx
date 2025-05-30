import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "STORE - Premium Fashion & Lifestyle",
  description: "Discover premium fashion and lifestyle products with our curated collection",
  generator: "Next.js",
  keywords: ["fashion", "clothing", "lifestyle", "premium", "ecommerce"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
