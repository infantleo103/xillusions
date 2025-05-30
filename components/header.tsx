"use client"

import { Search, ShoppingBag, User, Menu, Heart, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { state } = useCart()
  const { user } = useAuth()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b">
          <div className="text-muted-foreground">Free shipping on orders over $100</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Help
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Track Order
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold">
            STORE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/new-arrivals" className="text-foreground hover:text-primary font-medium">
              New Arrivals
            </Link>
            <Link href="/women" className="text-foreground hover:text-primary font-medium">
              Women
            </Link>
            <Link href="/men" className="text-foreground hover:text-primary font-medium">
              Men
            </Link>
            <Link href="/sale" className="text-foreground hover:text-primary font-medium">
              Sale
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 w-48 lg:w-64" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* User Menu */}
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              {/* Admin Dashboard Link - Only for admin users */}
              {user && user.role === 'admin' && (
                <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                  <Link href="/admin">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              {/* Register Link - Hidden on mobile */}
              <div className="hidden lg:block">
                {user ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile">My Account</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                )}
              </div>

              {/* Wishlist - Hidden on mobile */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {state.itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-6 mt-8">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input placeholder="Search products..." className="pl-10" />
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                      <Link href="/new-arrivals" className="block text-lg font-medium py-2">
                        New Arrivals
                      </Link>
                      <Link href="/women" className="block text-lg font-medium py-2">
                        Women
                      </Link>
                      <Link href="/men" className="block text-lg font-medium py-2">
                        Men
                      </Link>
                      <Link href="/sale" className="block text-lg font-medium py-2">
                        Sale
                      </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="space-y-4 pt-4 border-t">
                      <Link href="/profile" className="flex items-center gap-3 text-lg font-medium py-2">
                        <User className="h-5 w-5" />
                        Profile
                      </Link>
                      
                      {user ? (
                        <>
                          {user.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-3 text-lg font-medium py-2">
                              <LayoutDashboard className="h-5 w-5" />
                              Admin Dashboard
                            </Link>
                          )}
                        </>
                      ) : (
                        <Link href="/register" className="flex items-center gap-3 text-lg font-medium py-2">
                          <User className="h-5 w-5" />
                          Sign Up
                        </Link>
                      )}
                      
                      <button className="flex items-center gap-3 text-lg font-medium py-2 w-full text-left">
                        <Heart className="h-5 w-5" />
                        Wishlist
                      </button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
