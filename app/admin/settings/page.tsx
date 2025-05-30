"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage system settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="general" className="text-xs sm:text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs sm:text-sm">
            Users
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs sm:text-sm">
            Features
          </TabsTrigger>
          <TabsTrigger value="media" className="text-xs sm:text-sm">
            Media
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs sm:text-sm">
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="STORE" />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" defaultValue="https://store.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banner Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-4" />
                <p className="text-sm md:text-base text-gray-600 mb-2">
                  Drag and drop banner images here, or click to select
                </p>
                <p className="text-xs md:text-sm text-gray-500">Supports: JPG, PNG, WebP (Max: 5MB)</p>
                <Button variant="outline" className="mt-4 w-full sm:w-auto">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
