import { describe, it, expect } from '@jest/globals'
import { NextRequest } from 'next/server'
import { createGenericRouteHandlers } from '../lib/route-handler-factory'

describe('API Integration Tests', () => {
  it('should handle end-to-end API flow', async () => {
    const handlers = createGenericRouteHandlers({ entityName: 'materials' })

    // Test GET (should return mock materials)
    const getRequest = new NextRequest('http://localhost:3000/api/materials')
    const getResponse = await handlers.GET(getRequest)
    expect(getResponse.status).toBe(200)
    
    const getData = await getResponse.json()
    expect(Array.isArray(getData)).toBe(true)

    // Test POST
    const postRequest = new NextRequest('http://localhost:3000/api/materials', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Material', type: 'raw_material' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const postResponse = await handlers.POST(postRequest)
    expect(postResponse.status).toBe(201)
    
    const postData = await postResponse.json()
    expect(postData).toMatchObject({
      name: 'Test Material',
      type: 'raw_material',
      material_id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    })
  })
})
