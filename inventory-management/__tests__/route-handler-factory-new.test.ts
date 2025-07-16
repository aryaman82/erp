import { describe, it, expect, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'
import { createGenericRouteHandlers } from '../lib/route-handler-factory'

// Mock the mock-data module
jest.mock('../lib/mock-data', () => ({
  mockMaterials: [
    { material_id: 1, name: 'Test Material', type: 'raw_material' }
  ],
  mockBatches: [],
  mockTransactions: [],
  mockCustomers: [],
  mockDesigns: [],
  mockProduction: []
}))

describe('Route Handler Factory', () => {
  const handlers = createGenericRouteHandlers({ entityName: 'materials' })

  beforeEach(() => {
    // Reset mock database state if needed
  })

  describe('GET handler', () => {
    it('should handle GET requests for all entities', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials')
      const response = await handlers.GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(responseData)).toBe(true)
      expect(responseData).toEqual([
        { material_id: 1, name: 'Test Material', type: 'raw_material' }
      ])
    })

    it('should handle GET requests for specific entity', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials/1')
      const response = await handlers.GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData).toEqual({ material_id: 1, name: 'Test Material', type: 'raw_material' })
    })

    it('should return 404 for non-existent entity', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials/999')
      const response = await handlers.GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(404)
      expect(responseData).toEqual({ error: 'material not found' })
    })
  })

  describe('POST handler', () => {
    it('should handle POST requests', async () => {
      const postData = { name: 'New Material', type: 'raw_material' }
      const request = new NextRequest('http://localhost:3000/api/materials', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await handlers.POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData).toMatchObject({
        ...postData,
        material_id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    })

    it('should handle POST errors gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await handlers.POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData).toEqual({ error: 'Internal server error' })
    })
  })

  describe('PUT handler', () => {
    it('should handle PUT requests', async () => {
      const updateData = { name: 'Updated Material' }
      const request = new NextRequest('http://localhost:3000/api/materials/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await handlers.PUT(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData).toMatchObject({
        material_id: 1,
        name: 'Updated Material',
        updated_at: expect.any(String)
      })
    })

    it('should return 400 when ID is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Test' }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await handlers.PUT(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData).toEqual({ error: 'ID is required for update' })
    })
  })

  describe('DELETE handler', () => {
    it('should handle DELETE requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials/1', {
        method: 'DELETE'
      })

      const response = await handlers.DELETE(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData).toMatchObject({
        success: true,
        message: 'material deleted successfully'
      })
    })

    it('should return 400 when ID is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/materials', {
        method: 'DELETE'
      })

      const response = await handlers.DELETE(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData).toEqual({ error: 'ID is required for deletion' })
    })
  })
})
