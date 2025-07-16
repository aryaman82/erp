// __tests__/api-client.test.ts
import { fetchWithErrorHandling, APIError } from '../lib/api-client'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('fetchWithErrorHandling', () => {
    it('should handle successful GET requests', async () => {
      const mockData = { id: 1, name: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      } as Response)

      const result = await fetchWithErrorHandling('/test')
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      expect(result).toEqual(mockData)
    })

    it('should handle successful POST requests', async () => {
      const postData = { name: 'new test' }
      const mockResponse = { id: 1, name: 'new test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await fetchWithErrorHandling('/test', 'POST', postData)
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw APIError for HTTP errors', async () => {
      const errorResponse = { error: 'Not found' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      } as Response)

      try {
        await fetchWithErrorHandling('/test/999')
      } catch (error) {
        expect(error).toBeInstanceOf(APIError)
        if (error instanceof APIError) {
          expect(error.status).toBe(404)
          expect(error.message).toBe('Not found')
        }
      }
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchWithErrorHandling('/test')).rejects.toThrow(APIError)
      await expect(fetchWithErrorHandling('/test')).rejects.toThrow('Network error occurred')
    })

    it('should use custom API base URL when provided', async () => {
      const originalEnv = process.env.API_BASE_URL
      process.env.API_BASE_URL = 'https://api.example.com'

      const mockData = { id: 1 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      } as Response)

      await fetchWithErrorHandling('/test')
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', expect.any(Object))
      
      process.env.API_BASE_URL = originalEnv
    })
  })

  describe('APIError', () => {
    it('should create APIError with status and message', () => {
      const error = new APIError(404, 'Not found')
      
      expect(error.status).toBe(404)
      expect(error.message).toBe('Not found')
      expect(error.name).toBe('APIError')
      expect(error instanceof Error).toBe(true)
    })
  })
})