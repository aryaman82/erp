'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeManager } from '@/components/theme-manager'
import { ThemeTest } from '@/components/theme-test'
import { SchemaManager } from '@/components/schema-manager'
import { useSystem } from '@/contexts/SystemContext'
import { useModuleManager } from '@/hooks/use-module-manager'
import { ModuleManager } from '@/components/module-manager'
import { Plus, Settings } from 'lucide-react'

const AVAILABLE_ICONS = [
  'Home', 'Package', 'Layers', 'ArrowRightLeft', 'Factory', 'Palette', 'BarChart3',
  'Settings', 'Users', 'FileText', 'Calendar', 'Mail', 'Phone', 'MapPin',
  'ShoppingCart', 'CreditCard', 'Truck', 'Warehouse', 'CheckCircle'
]

export default function AdminPanel() {
  const { config, updateConfig } = useSystem()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <Badge variant="outline" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Admin Panel
        </Badge>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <ModuleManager />
        </TabsContent>

        {/* Schema Tab */}
        <TabsContent value="schema" className="space-y-6">
          <SchemaManager />
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ThemeTest />
            </div>
            <div className="lg:col-span-3">
              <ThemeManager />
            </div>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={JSON.stringify(config, null, 2)}
                onChange={(e) => updateConfig(JSON.parse(e.target.value))}
                rows={10}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
