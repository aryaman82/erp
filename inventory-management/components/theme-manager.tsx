'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSystem } from '@/contexts/SystemContext'
import { Palette, Plus, Edit, Trash2, Download, Upload, Eye, Paintbrush, Save, Copy } from 'lucide-react'
import type { ThemeConfig } from '@/types/system'
import { createCustomTheme, generateThemeCSS } from '@/lib/themes'

const COLOR_PRESETS = {
  blue: 'hsl(221.2 83.2% 53.3%)',
  green: 'hsl(134 61% 41%)',
  red: 'hsl(0 84.2% 60.2%)',
  orange: 'hsl(21 90% 48%)',
  purple: 'hsl(270 70% 55%)',
  teal: 'hsl(191 91% 36%)',
  pink: 'hsl(330 81% 60%)',
  indigo: 'hsl(243 75% 59%)',
}

export function ThemeManager() {
  const { 
    config, 
    setTheme, 
    addCustomTheme, 
    removeCustomTheme, 
    updateCustomTheme, 
    getCurrentTheme 
  } = useSystem()
  
  const [isCreateThemeOpen, setIsCreateThemeOpen] = useState(false)
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState<ThemeConfig | null>(null)
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null)
  
  const [newTheme, setNewTheme] = useState<Partial<ThemeConfig>>({
    name: '',
    description: '',
    darkMode: false,
    colors: {
      primary: COLOR_PRESETS.blue,
      secondary: 'hsl(210 40% 96%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      mutedForeground: 'hsl(215.4 16.3% 46.9%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      popoverForeground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(221.2 83.2% 53.3%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
    },
  })

  const allThemes = [...config.theme.themes, ...config.theme.customThemes]
  const currentTheme = getCurrentTheme()

  const handleCreateTheme = () => {
    if (!newTheme.name) return

    const baseTheme = config.theme.themes.find(t => t.id === 'default')!
    const theme = createCustomTheme(baseTheme, {
      ...newTheme,
      id: newTheme.name.toLowerCase().replace(/\s+/g, '-'),
    } as ThemeConfig)

    addCustomTheme(theme)
    setIsCreateThemeOpen(false)
    setNewTheme({
      name: '',
      description: '',
      darkMode: false,
      colors: {
        primary: COLOR_PRESETS.blue,
        secondary: 'hsl(210 40% 96%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        muted: 'hsl(210 40% 96%)',
        mutedForeground: 'hsl(215.4 16.3% 46.9%)',
        card: 'hsl(0 0% 100%)',
        cardForeground: 'hsl(222.2 84% 4.9%)',
        popover: 'hsl(0 0% 100%)',
        popoverForeground: 'hsl(222.2 84% 4.9%)',
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(221.2 83.2% 53.3%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveForeground: 'hsl(210 40% 98%)',
      },
    })
  }

  const handleEditTheme = () => {
    if (!editingTheme) return
    updateCustomTheme(editingTheme.id, editingTheme)
    setIsEditThemeOpen(false)
    setEditingTheme(null)
  }

  const handleDuplicateTheme = (theme: ThemeConfig) => {
    const duplicatedTheme: ThemeConfig = {
      ...theme,
      id: `${theme.id}-copy`,
      name: `${theme.name} Copy`,
    }
    addCustomTheme(duplicatedTheme)
  }

  const handleExportTheme = (theme: ThemeConfig) => {
    const dataStr = JSON.stringify(theme, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string) as ThemeConfig
        // Ensure unique ID
        theme.id = `${theme.id}-imported-${Date.now()}`
        addCustomTheme(theme)
      } catch (error) {
        console.error('Failed to import theme:', error)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const ThemePreview = ({ theme }: { theme: ThemeConfig }) => (
    <div className="grid grid-cols-5 gap-2 h-20">
      <div 
        className="rounded-md flex items-center justify-center text-xs font-medium text-white"
        style={{ backgroundColor: theme.colors.primary }}
      >
        Primary
      </div>
      <div 
        className="rounded-md flex items-center justify-center text-xs font-medium"
        style={{ 
          backgroundColor: theme.colors.secondary,
          color: theme.colors.foreground 
        }}
      >
        Secondary
      </div>
      <div 
        className="rounded-md flex items-center justify-center text-xs font-medium"
        style={{ 
          backgroundColor: theme.colors.background,
          color: theme.colors.foreground,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        Background
      </div>
      <div 
        className="rounded-md flex items-center justify-center text-xs font-medium text-white"
        style={{ backgroundColor: theme.colors.destructive }}
      >
        Destructive
      </div>
      <div 
        className="rounded-md flex items-center justify-center text-xs font-medium"
        style={{ 
          backgroundColor: theme.colors.muted,
          color: theme.colors.mutedForeground 
        }}
      >
        Muted
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6" />
          Theme Management
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateThemeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Theme
          </Button>
          <label htmlFor="theme-import">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import Theme
              </span>
            </Button>
          </label>
          <input
            id="theme-import"
            type="file"
            accept=".json"
            onChange={handleImportTheme}
            className="hidden"
          />
        </div>
      </div>

      {/* Current Theme */}
      {currentTheme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Current Theme: {currentTheme.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemePreview theme={currentTheme} />
          </CardContent>
        </Card>
      )}

      {/* Available Themes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allThemes.map((theme) => (
          <Card key={theme.id} className={theme.id === config.theme.current ? 'ring-2 ring-primary' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                <div className="flex gap-1">
                  {theme.id === config.theme.current && (
                    <Badge variant="default">Active</Badge>
                  )}
                  {config.theme.customThemes.find(t => t.id === theme.id) && (
                    <Badge variant="secondary">Custom</Badge>
                  )}
                  {theme.darkMode && (
                    <Badge variant="outline">Dark</Badge>
                  )}
                </div>
              </div>
              {theme.description && (
                <p className="text-sm text-muted-foreground">{theme.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <ThemePreview theme={theme} />
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => setTheme(theme.id)}
                  disabled={theme.id === config.theme.current}
                >
                  {theme.id === config.theme.current ? 'Applied' : 'Apply'}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicateTheme(theme)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicate
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportTheme(theme)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                
                {config.theme.customThemes.find(t => t.id === theme.id) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTheme(theme)
                        setIsEditThemeOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeCustomTheme(theme.id)}
                      disabled={theme.id === config.theme.current}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Theme Dialog */}
      <Dialog open={isCreateThemeOpen} onOpenChange={setIsCreateThemeOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Theme</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={newTheme.name || ''}
                  onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                  placeholder="My Custom Theme"
                />
              </div>
              <div>
                <Label htmlFor="theme-description">Description</Label>
                <Input
                  id="theme-description"
                  value={newTheme.description || ''}
                  onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                  placeholder="A beautiful custom theme"
                />
              </div>
            </div>

            <Tabs defaultValue="colors">
              <TabsList>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTheme.colors?.primary || ''}
                        onChange={(e) => setNewTheme({
                          ...newTheme,
                          colors: { ...newTheme.colors!, primary: e.target.value }
                        })}
                        placeholder="hsl(221.2 83.2% 53.3%)"
                      />
                      <div className="grid grid-cols-4 gap-1">
                        {Object.entries(COLOR_PRESETS).map(([name, color]) => (
                          <button
                            key={name}
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: color }}
                            onClick={() => setNewTheme({
                              ...newTheme,
                              colors: { ...newTheme.colors!, primary: color }
                            })}
                            title={name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Secondary Color</Label>
                    <Input
                      value={newTheme.colors?.secondary || ''}
                      onChange={(e) => setNewTheme({
                        ...newTheme,
                        colors: { ...newTheme.colors!, secondary: e.target.value }
                      })}
                      placeholder="hsl(210 40% 96%)"
                    />
                  </div>
                </div>
                
                {/* More color inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Background</Label>
                    <Input
                      value={newTheme.colors?.background || ''}
                      onChange={(e) => setNewTheme({
                        ...newTheme,
                        colors: { ...newTheme.colors!, background: e.target.value }
                      })}
                      placeholder="hsl(0 0% 100%)"
                    />
                  </div>
                  
                  <div>
                    <Label>Foreground</Label>
                    <Input
                      value={newTheme.colors?.foreground || ''}
                      onChange={(e) => setNewTheme({
                        ...newTheme,
                        colors: { ...newTheme.colors!, foreground: e.target.value }
                      })}
                      placeholder="hsl(222.2 84% 4.9%)"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="typography">
                <div className="space-y-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={newTheme.typography?.fontFamily || 'Inter'}
                      onValueChange={(value) => setNewTheme({
                        ...newTheme,
                        typography: { ...newTheme.typography!, fontFamily: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                {newTheme.colors && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Color Preview</h4>
                    <div className="grid grid-cols-5 gap-2 h-20">
                      <div 
                        className="rounded-md flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: newTheme.colors.primary }}
                      >
                        Primary
                      </div>
                      <div 
                        className="rounded-md flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: newTheme.colors.secondary,
                          color: newTheme.colors.foreground 
                        }}
                      >
                        Secondary
                      </div>
                      <div 
                        className="rounded-md flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: newTheme.colors.background,
                          color: newTheme.colors.foreground,
                          border: `1px solid ${newTheme.colors.border}`
                        }}
                      >
                        Background
                      </div>
                      <div 
                        className="rounded-md flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: newTheme.colors.destructive }}
                      >
                        Destructive
                      </div>
                      <div 
                        className="rounded-md flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: newTheme.colors.muted,
                          color: newTheme.colors.mutedForeground 
                        }}
                      >
                        Muted
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateThemeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTheme} disabled={!newTheme.name}>
                <Save className="h-4 w-4 mr-2" />
                Create Theme
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Theme Dialog */}
      <Dialog open={isEditThemeOpen} onOpenChange={setIsEditThemeOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Theme: {editingTheme?.name}</DialogTitle>
          </DialogHeader>
          
          {editingTheme && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-theme-name">Theme Name</Label>
                  <Input
                    id="edit-theme-name"
                    value={editingTheme.name}
                    onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-theme-description">Description</Label>
                  <Input
                    id="edit-theme-description"
                    value={editingTheme.description || ''}
                    onChange={(e) => setEditingTheme({ ...editingTheme, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <Input
                    value={editingTheme.colors.primary}
                    onChange={(e) => setEditingTheme({
                      ...editingTheme,
                      colors: { ...editingTheme.colors, primary: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <Label>Secondary Color</Label>
                  <Input
                    value={editingTheme.colors.secondary}
                    onChange={(e) => setEditingTheme({
                      ...editingTheme,
                      colors: { ...editingTheme.colors, secondary: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditThemeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTheme}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
