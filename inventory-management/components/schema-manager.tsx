'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Database, Table as TableIcon, FileCode, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import type { DatabaseSchema, TableSchema, SchemaField, ModuleConfig, FieldType } from '@/types/system'
import { SchemaDemo } from './schema-demo'

const FIELD_TYPES = [
  'string', 'number', 'boolean', 'date', 'datetime', 'text', 'json', 'reference'
]

const FIELD_ICONS = {
  string: 'Type',
  number: 'Hash',
  boolean: 'ToggleLeft',
  date: 'Calendar',
  datetime: 'Clock',
  text: 'FileText',
  json: 'Braces',
  reference: 'Link'
}

export function SchemaManager() {
  const [schema, setSchema] = useState<DatabaseSchema | null>(null)
  const [modules, setModules] = useState<ModuleConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false)
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableSchema | null>(null)
  const [editingField, setEditingField] = useState<{ table: string; field: SchemaField } | null>(null)
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  const [newTable, setNewTable] = useState({
    name: '',
    label: '',
    description: ''
  })

  const [newField, setNewField] = useState<Partial<SchemaField>>({
    name: '',
    label: '',
    type: { type: 'string', required: false },
    description: '',
    order: 0,
    displayInList: true,
    searchable: false,
    sortable: true,
    editable: true
  })

  useEffect(() => {
    loadSchema()
    loadModules()
  }, [])

  const loadSchema = async () => {
    try {
      const response = await fetch('/api/schema')
      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
      }
    } catch (error) {
      console.error('Error loading schema:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadModules = () => {
    // Load from system context or localStorage
    const stored = localStorage.getItem('system-config')
    if (stored) {
      const config = JSON.parse(stored)
      setModules(config.modules || [])
    }
  }

  const handleCreateTable = async () => {
    if (!newTable.name || !newTable.label) return

    try {
      const response = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_table',
          data: newTable
        })
      })

      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
        setNewTable({ name: '', label: '', description: '' })
        setIsCreateTableOpen(false)
        
        // Auto-generate module for the new table
        await generateModuleForTable(data.table)
      }
    } catch (error) {
      console.error('Error creating table:', error)
    }
  }

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_table',
          data: { id: tableId }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
        
        // Remove corresponding module
        const updatedModules = modules.filter(m => m.settings?.tableId !== tableId)
        setModules(updatedModules)
        localStorage.setItem('system-config', JSON.stringify({ modules: updatedModules }))
      }
    } catch (error) {
      console.error('Error deleting table:', error)
    }
  }

  const handleAddField = async () => {
    if (!selectedTable || !newField.name || !newField.label) return

    try {
      const response = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_field',
          data: {
            tableId: selectedTable,
            field: {
              ...newField,
              order: schema?.tables.find(t => t.id === selectedTable)?.fields.length || 0
            }
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
        setNewField({
          name: '',
          label: '',
          type: { type: 'string', required: false },
          description: '',
          order: 0,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        })
        setIsCreateFieldOpen(false)
      }
    } catch (error) {
      console.error('Error adding field:', error)
    }
  }

  const handleDeleteField = async (tableId: string, fieldName: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return

    try {
      const response = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_field',
          data: { tableId, fieldName }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
      }
    } catch (error) {
      console.error('Error deleting field:', error)
    }
  }

  const handleEditField = (tableId: string, field: SchemaField) => {
    setEditingField({ table: tableId, field })
    setNewField({
      name: field.name,
      label: field.label,
      type: field.type,
      description: field.description,
      order: field.order,
      displayInList: field.displayInList,
      searchable: field.searchable,
      sortable: field.sortable,
      editable: field.editable
    })
  }

  const handleUpdateField = async () => {
    if (!editingField || !newField.name || !newField.label) return

    try {
      const response = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'modify_field',
          data: {
            tableId: editingField.table,
            fieldName: editingField.field.name,
            updates: {
              ...newField,
              type: {
                type: newField.type?.type || 'string',
                ...newField.type
              }
            }
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSchema(data.schema)
        setEditingField(null)
        setNewField({
          name: '',
          label: '',
          type: { type: 'string', required: false },
          description: '',
          order: 0,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        })
      }
    } catch (error) {
      console.error('Error updating field:', error)
    }
  }

  const generateModuleForTable = async (table: TableSchema) => {
    try {
      // Generate the module configuration and component
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_from_schema',
          data: { table }
        })
      })

      const data = await response.json()
      if (data.success) {
        // Add the new module to the system
        const updatedModules = [...modules, data.module]
        setModules(updatedModules)
        localStorage.setItem('system-config', JSON.stringify({ modules: updatedModules }))
        
        // Create the actual page file
        const pageResponse = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_page',
            data: {
              path: `${table.name}/page.tsx`,
              content: data.component,
              overwrite: true
            }
          })
        })

        const pageData = await pageResponse.json()
        if (!pageData.success) {
          console.error('Failed to create page file:', pageData.error)
        }
      }
    } catch (error) {
      console.error('Error generating module:', error)
    }
  }

  const syncSchemaModules = async () => {
    if (!schema) return

    setSyncStatus('syncing')
    
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_schema_modules',
          data: { schema, currentModules: modules }
        })
      })

      const data = await response.json()
      if (data.success) {
        // Update modules based on sync results
        let updatedModules = [...modules]
        
        // Add created modules
        updatedModules.push(...data.syncResults.created)
        
        // Update existing modules
        for (const updatedModule of data.syncResults.updated) {
          const index = updatedModules.findIndex(m => m.id === updatedModule.id)
          if (index !== -1) {
            updatedModules[index] = updatedModule
          }
        }
        
        // Remove deleted modules
        updatedModules = updatedModules.filter(m => !data.syncResults.removed.includes(m.id))
        
        setModules(updatedModules)
        localStorage.setItem('system-config', JSON.stringify({ modules: updatedModules }))
        setSyncStatus('success')
        
        setTimeout(() => setSyncStatus('idle'), 2000)
      }
    } catch (error) {
      console.error('Error syncing schema modules:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading schema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Section */}
      <SchemaDemo />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schema Manager</h2>
          <p className="text-gray-600">Manage database schema and auto-generate modules</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={syncSchemaModules}
            disabled={syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : syncStatus === 'success' ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : syncStatus === 'error' ? (
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Modules
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="modules">Generated Modules</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          {/* Tables Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Tables
                </CardTitle>
                <Dialog open={isCreateTableOpen} onOpenChange={setIsCreateTableOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Table
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tableName">Table Name</Label>
                        <Input
                          id="tableName"
                          value={newTable.name}
                          onChange={(e) => setNewTable(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., products"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tableLabel">Display Label</Label>
                        <Input
                          id="tableLabel"
                          value={newTable.label}
                          onChange={(e) => setNewTable(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="e.g., Products"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tableDescription">Description</Label>
                        <Textarea
                          id="tableDescription"
                          value={newTable.description}
                          onChange={(e) => setNewTable(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of this table"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreateTable} className="flex-1">
                          Create Table
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreateTableOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {schema?.tables.map((table) => (
                  <Card key={table.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TableIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <h3 className="font-semibold">{table.label}</h3>
                            <p className="text-sm text-gray-600">{table.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {table.fields.length} fields
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTable(table.id)
                              setIsCreateFieldOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Field
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateModuleForTable(table)}
                          >
                            <FileCode className="h-4 w-4 mr-1" />
                            Generate Module
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTable(table.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {table.description && (
                        <p className="text-sm text-gray-600">{table.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Options</TableHead>
                            <TableHead>Display</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.fields.map((field) => (
                            <TableRow key={field.name}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{field.label}</div>
                                  <div className="text-sm text-gray-500">{field.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {field.type.type}
                                  {field.type.required && ' *'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {field.searchable && <Badge variant="secondary" className="text-xs">Searchable</Badge>}
                                  {field.sortable && <Badge variant="secondary" className="text-xs">Sortable</Badge>}
                                  {field.type.unique && <Badge variant="secondary" className="text-xs">Unique</Badge>}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {field.displayInList && <Badge variant="outline" className="text-xs">List</Badge>}
                                  {field.editable && <Badge variant="outline" className="text-xs">Editable</Badge>}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditField(table.id, field)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteField(table.id, field.name)}
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Field Dialog */}
          <Dialog open={isCreateFieldOpen} onOpenChange={setIsCreateFieldOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Field to Table</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input
                      id="fieldName"
                      value={newField.name || ''}
                      onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., product_name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldLabel">Display Label</Label>
                    <Input
                      id="fieldLabel"
                      value={newField.label || ''}
                      onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Product Name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="fieldType">Field Type</Label>
                  <Select 
                    value={newField.type?.type || 'string'} 
                    onValueChange={(value) => setNewField(prev => ({ 
                      ...prev, 
                      type: { ...prev.type, type: value as any } 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fieldDescription">Description</Label>
                  <Textarea
                    id="fieldDescription"
                    value={newField.description || ''}
                    onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this field"
                  />
                </div>

                {/* Enum Values (for string types) */}
                {newField.type?.type === 'string' && (
                  <div>
                    <Label htmlFor="enumValues">Enum Values (comma-separated)</Label>
                    <Input
                      id="enumValues"
                      value={newField.type?.validation?.enum?.join(', ') || ''}
                      onChange={(e) => {
                        const enumValues = e.target.value.split(',').map(v => v.trim()).filter(v => v.length > 0)
                        setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            ...prev.type,
                            type: 'string',
                            validation: {
                              ...prev.type?.validation,
                              enum: enumValues.length > 0 ? enumValues : undefined
                            }
                          } 
                        }))
                      }}
                      placeholder="e.g., active, pending, inactive"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for free text input
                    </p>
                  </div>
                )}

                {/* Number validation */}
                {newField.type?.type === 'number' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minValue">Minimum Value</Label>
                      <Input
                        id="minValue"
                        type="number"
                        value={newField.type?.validation?.min || ''}
                        onChange={(e) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            ...prev.type,
                            type: 'number',
                            validation: {
                              ...prev.type?.validation,
                              min: e.target.value ? Number(e.target.value) : undefined
                            }
                          } 
                        }))}
                        placeholder="Optional minimum"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxValue">Maximum Value</Label>
                      <Input
                        id="maxValue"
                        type="number"
                        value={newField.type?.validation?.max || ''}
                        onChange={(e) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            ...prev.type,
                            type: 'number',
                            validation: {
                              ...prev.type?.validation,
                              max: e.target.value ? Number(e.target.value) : undefined
                            }
                          } 
                        }))}
                        placeholder="Optional maximum"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.type?.required || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            type: prev.type?.type || 'string', 
                            required: checked,
                            ...prev.type
                          } 
                        }))}
                      />
                      <Label>Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.displayInList || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, displayInList: checked }))}
                      />
                      <Label>Show in List</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.searchable || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, searchable: checked }))}
                      />
                      <Label>Searchable</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.sortable || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, sortable: checked }))}
                      />
                      <Label>Sortable</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.editable || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, editable: checked }))}
                      />
                      <Label>Editable</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.type?.unique || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            type: prev.type?.type || 'string', 
                            unique: checked,
                            ...prev.type
                          } 
                        }))}
                      />
                      <Label>Unique</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddField} className="flex-1">
                    Add Field
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateFieldOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Field Dialog */}
          <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFieldName">Field Name</Label>
                    <Input
                      id="editFieldName"
                      value={newField.name || ''}
                      onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., product_name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editFieldLabel">Display Label</Label>
                    <Input
                      id="editFieldLabel"
                      value={newField.label || ''}
                      onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Product Name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="editFieldType">Field Type</Label>
                  <Select 
                    value={newField.type?.type || 'string'} 
                    onValueChange={(value) => setNewField(prev => ({ 
                      ...prev, 
                      type: { 
                        type: value as any,
                        ...prev.type
                      } 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="editFieldDescription">Description</Label>
                  <Textarea
                    id="editFieldDescription"
                    value={newField.description || ''}
                    onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this field"
                  />
                </div>

                {/* Enum Values (for string types) */}
                {newField.type?.type === 'string' && (
                  <div>
                    <Label htmlFor="editEnumValues">Enum Values (comma-separated)</Label>
                    <Input
                      id="editEnumValues"
                      value={newField.type?.validation?.enum?.join(', ') || ''}
                      onChange={(e) => {
                        const enumValues = e.target.value.split(',').map(v => v.trim()).filter(v => v.length > 0)
                        setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            ...prev.type,
                            type: 'string',
                            validation: {
                              ...prev.type?.validation,
                              enum: enumValues.length > 0 ? enumValues : undefined
                            }
                          } 
                        }))
                      }}
                      placeholder="e.g., active, pending, inactive"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for free text input
                    </p>
                  </div>
                )}

                {/* Number validation */}
                {newField.type?.type === 'number' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editMinValue">Minimum Value</Label>
                      <Input
                        id="editMinValue"
                        type="number"
                        value={newField.type?.validation?.min || ''}
                        onChange={(e) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            ...prev.type,
                            type: 'number',
                            validation: {
                              ...prev.type?.validation,
                              min: e.target.value ? Number(e.target.value) : undefined
                            }
                          } 
                        }))}
                        placeholder="Optional minimum"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editMaxValue">Maximum Value</Label>
                      <Input
                        id="editMaxValue"
                        type="number"
                        value={newField.type?.validation?.max || ''}
                        onChange={(e) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            ...prev.type,
                            type: 'number',
                            validation: {
                              ...prev.type?.validation,
                              max: e.target.value ? Number(e.target.value) : undefined
                            }
                          } 
                        }))}
                        placeholder="Optional maximum"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.type?.required || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            type: prev.type?.type || 'string', 
                            required: checked,
                            ...prev.type
                          } 
                        }))}
                      />
                      <Label>Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.displayInList || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, displayInList: checked }))}
                      />
                      <Label>Show in List</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.searchable || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, searchable: checked }))}
                      />
                      <Label>Searchable</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.sortable || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, sortable: checked }))}
                      />
                      <Label>Sortable</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.editable || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, editable: checked }))}
                      />
                      <Label>Editable</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.type?.unique || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ 
                          ...prev, 
                          type: { 
                            type: prev.type?.type || 'string', 
                            unique: checked,
                            ...prev.type
                          } 
                        }))}
                      />
                      <Label>Unique</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateField} className="flex-1">
                    Update Field
                  </Button>
                  <Button variant="outline" onClick={() => setEditingField(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Generated Modules</CardTitle>
              <p className="text-sm text-gray-600">
                Modules automatically created from database schema
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {modules
                  .filter(module => module.settings?.tableId)
                  .map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileCode className="h-5 w-5 text-blue-500" />
                        <div>
                          <h3 className="font-medium">{module.name}</h3>
                          <p className="text-sm text-gray-600">
                            Generated from table: {module.settings?.tableId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={module.enabled ? 'default' : 'secondary'}>
                          {module.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Badge variant="outline">
                          {module.path}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schema Migrations</CardTitle>
              <p className="text-sm text-gray-600">
                Track schema changes and migrations
              </p>
            </CardHeader>
            <CardContent>
              {schema?.migrations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No migrations yet
                </p>
              ) : (
                <div className="space-y-2">
                  {schema?.migrations.map((migration) => (
                    <div key={migration.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{migration.description}</h4>
                        <p className="text-sm text-gray-600">Version: {migration.version}</p>
                      </div>
                      <Badge variant={
                        migration.status === 'applied' ? 'default' :
                        migration.status === 'failed' ? 'destructive' :
                        'secondary'
                      }>
                        {migration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
