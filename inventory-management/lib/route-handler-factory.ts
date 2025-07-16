// lib/route-handler-factory.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  mockMaterials, 
  mockBatches, 
  mockTransactions, 
  mockCustomers, 
  mockDesigns, 
  mockProduction 
} from './mock-data'

export interface RouteConfig {
  entityName: string
  idParam?: string
}

// Mock database simulation
const mockDatabase: Record<string, any[]> = {
  materials: [...mockMaterials],
  batches: [...mockBatches],
  transactions: [...mockTransactions],
  customers: [...mockCustomers],
  designs: [...mockDesigns],
  production: [...mockProduction]
}

export function createGenericRouteHandlers(config: RouteConfig) {
  const { entityName, idParam = 'id' } = config

  return {
    async GET(request: NextRequest, { params }: { params: Promise<{ id?: string }> }): Promise<NextResponse> {
      try {
        const data = mockDatabase[entityName] || []
        const resolvedParams = await params
        
        // If params.id exists, this is a dynamic route request for a specific item
        if (resolvedParams?.id) {
          const id = resolvedParams.id
          const idField = `${entityName.slice(0, -1)}_id` // Remove 's' and add '_id'
          
          const item = data.find((item: any) => 
            item[idField]?.toString() === id || 
            item.id?.toString() === id
          )
          
          if (!item) {
            return NextResponse.json(
              { error: `${entityName.slice(0, -1)} not found` },
              { status: 404 }
            )
          }
          
          return NextResponse.json(item)
        }
        
        // Return all items for collection routes
        return NextResponse.json(data)
      } catch (error) {
        console.error(`GET /${entityName} error:`, error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    },

    async POST(request: NextRequest): Promise<NextResponse> {
      try {
        const body = await request.json()
        const data = mockDatabase[entityName] || []
        
        // Generate new ID
        const idField = `${entityName.slice(0, -1)}_id`
        const maxId = data.length > 0 ? Math.max(...data.map((item: any) => item[idField] || 0)) : 0
        const newId = maxId + 1
        
        const newItem = {
          ...body,
          [idField]: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        mockDatabase[entityName].push(newItem)
        
        return NextResponse.json(newItem, { status: 201 })
      } catch (error) {
        console.error(`POST /${entityName} error:`, error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    },

    async PUT(request: NextRequest, { params }: { params: Promise<{ id?: string }> }): Promise<NextResponse> {
      try {
        const body = await request.json()
        const resolvedParams = await params
        const id = resolvedParams?.id
        
        if (!id) {
          return NextResponse.json(
            { error: 'ID is required for update' },
            { status: 400 }
          )
        }

        const data = mockDatabase[entityName] || []
        const idField = `${entityName.slice(0, -1)}_id`
        const itemIndex = data.findIndex((item: any) => 
          item[idField]?.toString() === id || 
          item.id?.toString() === id
        )
        
        if (itemIndex === -1) {
          return NextResponse.json(
            { error: `${entityName.slice(0, -1)} not found` },
            { status: 404 }
          )
        }
        
        const updatedItem = {
          ...data[itemIndex],
          ...body,
          updated_at: new Date().toISOString()
        }
        
        mockDatabase[entityName][itemIndex] = updatedItem
        
        return NextResponse.json(updatedItem)
      } catch (error) {
        console.error(`PUT /${entityName} error:`, error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    },

    async DELETE(request: NextRequest, { params }: { params: Promise<{ id?: string }> }): Promise<NextResponse> {
      try {
        const resolvedParams = await params
        const id = resolvedParams?.id
        
        if (!id) {
          return NextResponse.json(
            { error: 'ID is required for deletion' },
            { status: 400 }
          )
        }

        const data = mockDatabase[entityName] || []
        const idField = `${entityName.slice(0, -1)}_id`
        const itemIndex = data.findIndex((item: any) => 
          item[idField]?.toString() === id || 
          item.id?.toString() === id
        )
        
        if (itemIndex === -1) {
          return NextResponse.json(
            { error: `${entityName.slice(0, -1)} not found` },
            { status: 404 }
          )
        }
        
        const deletedItem = mockDatabase[entityName].splice(itemIndex, 1)[0]
        
        return NextResponse.json({ 
          success: true, 
          message: `${entityName.slice(0, -1)} deleted successfully`,
          deleted: deletedItem
        })
      } catch (error) {
        console.error(`DELETE /${entityName} error:`, error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  }
}
