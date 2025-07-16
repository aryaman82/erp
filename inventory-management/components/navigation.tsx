"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Factory, Package, ArrowRightLeft, BarChart3, Settings, Menu, Home, Layers, Palette, Eye, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSystem } from "@/contexts/SystemContext"

// Icon mapping
const iconMap = {
  Home, Package, Layers, ArrowRightLeft, Factory: Factory, Palette, BarChart3, Settings,
  Eye, Code
}

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { config } = useSystem()

  // Get enabled modules sorted by order
  const enabledModules = config.modules
    .filter(module => module.enabled)
    .sort((a, b) => a.order - b.order)

  // Add admin module if enabled
  const navigation = [
    ...enabledModules.map(module => ({
      name: module.name,
      href: module.path,
      icon: iconMap[module.icon as keyof typeof iconMap] || Package,
      description: module.description
    })),
    ...(config.features.adminPanel ? [{
      name: "Admin",
      href: "/admin",
      icon: Settings,
      description: "System administration"
    }] : [])
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Factory className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Almed</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
