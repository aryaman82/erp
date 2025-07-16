'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, Plus, Zap, CheckCircle } from 'lucide-react'

export function SchemaDemo() {
  const [demoStep, setDemoStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const demoTables = [
    {
      name: 'customers',
      label: 'Customers',
      description: 'Customer relationship management',
      fields: [
        { name: 'name', label: 'Customer Name', type: 'string' },
        { name: 'email', label: 'Email', type: 'string' },
        { name: 'phone', label: 'Phone', type: 'string' },
        { name: 'company', label: 'Company', type: 'string' },
        { name: 'status', label: 'Status', type: 'string' }
      ]
    },
    {
      name: 'suppliers',
      label: 'Suppliers',
      description: 'Supplier management system',
      fields: [
        { name: 'company_name', label: 'Company Name', type: 'string' },
        { name: 'contact_person', label: 'Contact Person', type: 'string' },
        { name: 'email', label: 'Email', type: 'string' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'rating', label: 'Rating', type: 'number' }
      ]
    },
    {
      name: 'orders',
      label: 'Orders',
      description: 'Order management and tracking',
      fields: [
        { name: 'order_number', label: 'Order Number', type: 'string' },
        { name: 'customer_id', label: 'Customer', type: 'reference' },
        { name: 'total_amount', label: 'Total Amount', type: 'number' },
        { name: 'status', label: 'Status', type: 'string' },
        { name: 'order_date', label: 'Order Date', type: 'date' }
      ]
    }
  ]

  const runDemo = async () => {
    setIsGenerating(true)
    setDemoStep(1)

    // Simulate creating tables and generating modules
    for (let i = 0; i < demoTables.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setDemoStep(i + 2)
    }

    setDemoStep(5) // Complete
    setIsGenerating(false)
  }

  const resetDemo = () => {
    setDemoStep(0)
    setIsGenerating(false)
  }

  return (          <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Schema Management with Field Editing
        </CardTitle>
        <p className="text-sm text-gray-600">
          Create tables, edit fields, and auto-generate modules with advanced validation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoStep === 0 && (        <div className="text-center space-y-4">
          <p className="text-gray-600">
            This demo showcases the new field editing capabilities:
          </p>
          <div className="grid gap-2">
            <div className="p-3 border rounded bg-blue-50">
              <h4 className="font-medium text-blue-700">✏️ Edit Existing Fields</h4>
              <p className="text-sm text-blue-600">Click edit button on any field to modify properties</p>
            </div>
            <div className="p-3 border rounded bg-green-50">
              <h4 className="font-medium text-green-700">🎯 Advanced Validation</h4>
              <p className="text-sm text-green-600">Set enum values, number ranges, and field requirements</p>
            </div>
            <div className="p-3 border rounded bg-purple-50">
              <h4 className="font-medium text-purple-700">🔄 Real-time Updates</h4>
              <p className="text-sm text-purple-600">Changes apply immediately to generated modules</p>
            </div>
          </div>
            <div className="grid gap-2">
              {demoTables.map((table) => (
                <div key={table.name} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{table.label}</h4>
                    <p className="text-sm text-gray-600">{table.description}</p>
                  </div>
                  <Badge variant="outline">{table.fields.length} fields</Badge>
                </div>
              ))}
            </div>
            <Button onClick={runDemo} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Run Demo
            </Button>
          </div>
        )}

        {demoStep > 0 && demoStep < 5 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="font-medium">
                {demoStep === 1 && "Initializing schema creation..."}
                {demoStep === 2 && "Creating Customers table and module..."}
                {demoStep === 3 && "Creating Suppliers table and module..."}
                {demoStep === 4 && "Creating Orders table and module..."}
              </p>
            </div>
            <div className="space-y-2">
              {demoTables.map((table, index) => (
                <div key={table.name} className="flex items-center gap-3 p-2">
                  {demoStep > index + 1 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : demoStep === index + 2 ? (
                    <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                  <span className={`${demoStep > index + 1 ? 'text-green-700' : demoStep === index + 2 ? 'text-blue-700' : 'text-gray-500'}`}>
                    {table.label} ({table.fields.length} fields)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {demoStep === 5 && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-green-700">Demo Complete!</h3>
              <p className="text-sm text-gray-600">
                3 new tables created with auto-generated modules
              </p>
            </div>
            <div className="grid gap-2">
              {demoTables.map((table) => (
                <div key={table.name} className="flex items-center justify-between p-3 border rounded bg-green-50">
                  <div>
                    <h4 className="font-medium text-green-700">{table.label}</h4>
                    <p className="text-sm text-green-600">Module created at /{table.name}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetDemo} className="flex-1">
                Reset Demo
              </Button>
              <Button className="flex-1" onClick={() => window.open('/customers', '_blank')}>
                View Generated Module
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
