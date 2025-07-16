import { NextRequest, NextResponse } from 'next/server'
import type { ModuleConfig, TableSchema, ModuleTemplate } from '@/types/system'

// Module templates for different types of tables
const MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    id: 'crud',
    name: 'CRUD Module',
    description: 'Standard Create, Read, Update, Delete operations',
    type: 'crud',
    icon: 'Package',
    fields: [],
    views: {
      list: true,
      detail: true,
      create: true,
      edit: true,
      delete: true
    }
  },
  {
    id: 'readonly',
    name: 'Read-Only Module',
    description: 'View-only module for reports and analytics',
    type: 'report',
    icon: 'BarChart3',
    fields: [],
    views: {
      list: true,
      detail: true,
      create: false,
      edit: false,
      delete: false
    }
  },
  {
    id: 'dashboard',
    name: 'Dashboard Module',
    description: 'Dashboard with widgets and charts',
    type: 'dashboard',
    icon: 'Home',
    fields: [],
    views: {
      list: false,
      detail: false,
      create: false,
      edit: false,
      delete: false
    },
    customViews: [
      {
        name: 'Dashboard',
        path: '/',
        component: 'DashboardView'
      }
    ]
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      templates: MODULE_TEMPLATES
    })
  } catch (error) {
    console.error('Error fetching module templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'generate_from_schema':
        return await generateModuleFromSchema(data)
      case 'generate_from_template':
        return await generateModuleFromTemplate(data)
      case 'sync_schema_modules':
        return await syncSchemaModules(data)
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error handling module generation request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process module generation request' },
      { status: 500 }
    )
  }
}

async function generateModuleFromSchema(data: { table: TableSchema; template?: string }): Promise<NextResponse> {
  const { table, template = 'crud' } = data
  
  const moduleTemplate = MODULE_TEMPLATES.find(t => t.id === template)
  if (!moduleTemplate) {
    return NextResponse.json(
      { success: false, error: 'Template not found' },
      { status: 404 }
    )
  }

  // Generate module configuration
  const moduleConfig: ModuleConfig = {
    id: table.id,
    name: table.label,
    path: `/${table.name}`,
    icon: getIconForTable(table),
    description: table.description || `Manage ${table.label.toLowerCase()}`,
    enabled: true,
    order: 999, // Place new modules at the end
    permissions: generatePermissions(table),
    component: generateComponentName(table, moduleTemplate),
    settings: {
      tableId: table.id,
      template: template,
      fields: table.fields,
      permissions: table.permissions,
      displaySettings: table.displaySettings,
      relationships: table.relationships || []
    }
  }

  // Generate the actual page component
  const pageComponent = generatePageComponent(table, moduleTemplate)
  
  return NextResponse.json({
    success: true,
    module: moduleConfig,
    component: pageComponent,
    files: [
      {
        path: `app/${table.name}/page.tsx`,
        content: pageComponent
      }
    ]
  })
}

async function generateModuleFromTemplate(data: { name: string; template: string; config?: any }): Promise<NextResponse> {
  const { name, template, config = {} } = data
  
  const moduleTemplate = MODULE_TEMPLATES.find(t => t.id === template)
  if (!moduleTemplate) {
    return NextResponse.json(
      { success: false, error: 'Template not found' },
      { status: 404 }
    )
  }

  const moduleName = name.toLowerCase().replace(/\s+/g, '-')
  
  const moduleConfig: ModuleConfig = {
    id: moduleName,
    name: name,
    path: `/${moduleName}`,
    icon: config.icon || moduleTemplate.icon,
    description: config.description || `${name} module`,
    enabled: true,
    order: 999,
    permissions: config.permissions || [`view_${moduleName}`, `edit_${moduleName}`],
    component: `${name.replace(/\s+/g, '')}Page`,
    settings: {
      template: template,
      ...config
    }
  }

  const pageComponent = generateCustomPageComponent(name, moduleTemplate, config)
  
  return NextResponse.json({
    success: true,
    module: moduleConfig,
    component: pageComponent,
    files: [
      {
        path: `app/${moduleName}/page.tsx`,
        content: pageComponent
      }
    ]
  })
}

async function syncSchemaModules(data: { schema: { tables: TableSchema[] }; currentModules: ModuleConfig[] }): Promise<NextResponse> {
  const { schema, currentModules } = data
  const syncResults = {
    created: [] as ModuleConfig[],
    updated: [] as ModuleConfig[],
    removed: [] as string[],
    unchanged: [] as string[]
  }

  // Create modules for new tables
  const existingTableModules = currentModules.filter(m => m.settings?.tableId)
  const existingTableIds = new Set(existingTableModules.map(m => m.settings?.tableId))

  for (const table of schema.tables) {
    if (!existingTableIds.has(table.id)) {
      const result = await generateModuleFromSchema({ table })
      if (result.status === 200) {
        const moduleData = await result.json()
        syncResults.created.push(moduleData.module)
      }
    } else {
      // Check if table has been updated and module needs updating
      const existingModule = existingTableModules.find(m => m.settings?.tableId === table.id)
      if (existingModule && shouldUpdateModule(table, existingModule)) {
        const updatedModule = updateModuleFromTable(table, existingModule)
        syncResults.updated.push(updatedModule)
      } else {
        syncResults.unchanged.push(table.id)
      }
    }
  }

  // Remove modules for deleted tables
  const currentTableIds = new Set(schema.tables.map(t => t.id))
  for (const moduleItem of existingTableModules) {
    if (!currentTableIds.has(moduleItem.settings?.tableId)) {
      syncResults.removed.push(moduleItem.id)
    }
  }

  return NextResponse.json({
    success: true,
    syncResults
  })
}

function getIconForTable(table: TableSchema): string {
  const iconMap: Record<string, string> = {
    'users': 'Users',
    'materials': 'Package',
    'batches': 'Layers',
    'transactions': 'ArrowRightLeft',
    'products': 'ShoppingCart',
    'orders': 'FileText',
    'customers': 'Users',
    'suppliers': 'Truck',
    'inventory': 'Warehouse',
    'reports': 'BarChart3',
    'settings': 'Settings'
  }

  return iconMap[table.name] || 'Package'
}

function generatePermissions(table: TableSchema): string[] {
  const permissions = []
  const baseName = table.name.replace(/s$/, '') // Remove plural 's'
  
  if (table.permissions?.read) permissions.push(`view_${table.name}`)
  if (table.permissions?.create) permissions.push(`add_${baseName}`)
  if (table.permissions?.update) permissions.push(`edit_${baseName}`)
  if (table.permissions?.delete) permissions.push(`delete_${baseName}`)
  
  return permissions
}

function generateComponentName(table: TableSchema, template: ModuleTemplate): string {
  const baseName = table.label.replace(/\s+/g, '')
  return `${baseName}Page`
}

function generatePageComponent(table: TableSchema, template: ModuleTemplate): string {
  const componentName = generateComponentName(table, template)
  const tableName = table.name
  const tableLabel = table.label
  
  return `'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

interface ${table.label.replace(/\s+/g, '')}Item {
${table.fields.map(field => {
  const tsType = getTypeScriptType(field.type.type)
  const optional = field.type.required ? '' : '?'
  return `  ${field.name}${optional}: ${tsType}`
}).join('\n')}
}

export default function ${componentName}() {
  const [items, setItems] = useState<${table.label.replace(/\s+/g, '')}Item[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<${table.label.replace(/\s+/g, '')}Item | null>(null)
  const [formData, setFormData] = useState<Partial<${table.label.replace(/\s+/g, '')}Item>>({})

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const stored = localStorage.getItem('${tableName}')
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }

  const saveItems = (newItems: ${table.label.replace(/\s+/g, '')}Item[]) => {
    localStorage.setItem('${tableName}', JSON.stringify(newItems))
    setItems(newItems)
  }

  const handleCreate = () => {
    if (!formData.${table.fields.find(f => f.name !== 'id' && f.name !== 'createdAt')?.name || 'name'}) return

    const newItem: ${table.label.replace(/\s+/g, '')}Item = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    } as ${table.label.replace(/\s+/g, '')}Item

    const newItems = [...items, newItem]
    saveItems(newItems)
    setFormData({})
    setIsCreateOpen(false)
  }

  const handleEdit = (item: ${table.label.replace(/\s+/g, '')}Item) => {
    setEditingItem(item)
    setFormData(item)
  }

  const handleUpdate = () => {
    if (!editingItem) return

    const updatedItems = items.map(item =>
      item.id === editingItem.id ? { ...item, ...formData } : item
    )
    saveItems(updatedItems)
    setEditingItem(null)
    setFormData({})
  }

  const handleDelete = (id: string) => {
    const newItems = items.filter(item => item.id !== id)
    saveItems(newItems)
  }

  const filteredItems = items.filter(item =>
    ${table.fields.filter(f => f.searchable).map(f => 
      `item.${f.name}?.toString().toLowerCase().includes(searchTerm.toLowerCase())`
    ).join(' || ') || 'true'}
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">${tableLabel}</h1>
          <p className="text-gray-600">${table.description || `Manage ${tableLabel.toLowerCase()}`}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ${tableLabel.toLowerCase()}..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add ${table.label.replace(/s$/, '')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New ${table.label.replace(/s$/, '')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                ${table.fields
                  .filter(f => f.editable && f.name !== 'id' && f.name !== 'createdAt')
                  .map(field => generateFormField(field))
                  .join('\n                ')}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreate} className="flex-1">Create</Button>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>${tableLabel} List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                ${table.fields
                  .filter(f => f.displayInList)
                  .map(f => `<TableHead>${f.label}</TableHead>`)
                  .join('\n                ')}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  ${table.fields
                    .filter(f => f.displayInList)
                    .map(f => generateTableCell(f))
                    .join('\n                  ')}
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit ${table.label.replace(/s$/, '')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            ${table.fields
              .filter(f => f.editable && f.name !== 'id' && f.name !== 'createdAt')
              .map(field => generateFormField(field))
              .join('\n            ')}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdate} className="flex-1">Update</Button>
              <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}`
}

function generateCustomPageComponent(name: string, template: ModuleTemplate, config: any): string {
  const componentName = `${name.replace(/\s+/g, '')}Page`
  
  return `'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ${componentName}() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">${name}</h1>
          <p className="text-gray-600">${config.description || `${name} module`}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>${name} Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is a custom ${template.name.toLowerCase()} module. 
            Add your custom functionality here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}`
}

function getTypeScriptType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'date': 'string',
    'datetime': 'string',
    'text': 'string',
    'json': 'any',
    'reference': 'string'
  }
  
  return typeMap[fieldType] || 'string'
}

function generateFormField(field: any): string {
  const fieldName = field.name
  const fieldLabel = field.label
  const fieldType = field.type.type
  
  if (fieldType === 'boolean') {
    return `<div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.${fieldName} || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, ${fieldName}: e.target.checked }))}
                  />
                  <Label>${fieldLabel}</Label>
                </div>`
  }
  
  if (field.type.validation?.enum) {
    return `<div>
                  <Label htmlFor="${fieldName}">${fieldLabel}</Label>
                  <select
                    value={formData.${fieldName} || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ${fieldName}: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select ${fieldLabel}</option>
                    ${field.type.validation.enum.map((option: string) => 
                      `<option value="${option}">${option}</option>`
                    ).join('\n                    ')}
                  </select>
                </div>`
  }
  
  const inputType = fieldType === 'number' ? 'number' : 
                   fieldType === 'date' ? 'date' :
                   fieldType === 'datetime' ? 'datetime-local' : 'text'
  
  return `<div>
                  <Label htmlFor="${fieldName}">${fieldLabel}</Label>
                  <Input
                    id="${fieldName}"
                    type="${inputType}"
                    value={formData.${fieldName} || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ${fieldName}: e.target.value }))}
                    ${field.type.required ? 'required' : ''}
                  />
                </div>`
}

function generateTableCell(field: any): string {
  const fieldName = field.name
  
  if (field.type.type === 'boolean') {
    return `<TableCell>{item.${fieldName} ? 'Yes' : 'No'}</TableCell>`
  }
  
  if (field.type.type === 'date' || field.type.type === 'datetime') {
    return `<TableCell>{item.${fieldName} ? new Date(item.${fieldName}).toLocaleDateString() : ''}</TableCell>`
  }
  
  return `<TableCell>{item.${fieldName}}</TableCell>`
}

function shouldUpdateModule(table: TableSchema, module: ModuleConfig): boolean {
  // Check if the table has been updated more recently than the module
  const tableUpdated = new Date(table.updatedAt)
  const moduleSettings = module.settings
  
  if (!moduleSettings?.lastSynced) return true
  
  const lastSynced = new Date(moduleSettings.lastSynced)
  return tableUpdated > lastSynced
}

function updateModuleFromTable(table: TableSchema, existingModule: ModuleConfig): ModuleConfig {
  return {
    ...existingModule,
    name: table.label,
    description: table.description || existingModule.description,
    settings: {
      ...existingModule.settings,
      fields: table.fields,
      permissions: table.permissions,
      displaySettings: table.displaySettings,
      relationships: table.relationships || [],
      lastSynced: new Date().toISOString()
    }
  }
}
