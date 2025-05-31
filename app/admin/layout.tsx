"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Users, Package, ShoppingCart, Settings, Database, Palette, Factory, DollarSign, TrendingUp, Menu, Home, Shirt, Warehouse } from 'lucide-react'

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "T-Shirts", href: "/admin/tshirts", icon: Shirt },
  { name: "Customization", href: "/admin/customization", icon: Palette },
  { name: "Production", href: "/admin/production", icon: Factory },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Database", href: "/admin/database", icon: Database },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  // Basic auth check at layout level
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login')
    } else if (!isLoading && user && user.role !== 'admin') {
      // If user is logged in but not an admin, redirect to login
      router.push('/admin/login')
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
