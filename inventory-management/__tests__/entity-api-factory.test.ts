import { createEntityAPI } from '../lib/entity-api-factory'
import { fetchWithErrorHandling } from '../lib/api-client'

// Mock the api-client module
jest.mock('../lib/api-client')

const mockFetchWithErrorHandling = fetchWithErrorHandling as jest.MockedFunction<typeof fetchWithErrorHandling>

interface TestEntity {
  id: number
  name: string
}

describe('Entity API Factory', () => {
  const testAPI = createEntityAPI<TestEntity>('test')

  beforeEach(() => {
    mockFetchWithErrorHandling.mockClear()
  })

  describe('getAll', () => {
    it('should fetch all entities', async () => {
      const mockData = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }]
      mockFetchWithErrorHandling.mockResolvedValueOnce(mockData)

      const result = await testAPI.getAll()

      expect(mockFetchWithErrorHandling).toHaveBeenCalledWith('/api/test')
      expect(result).toEqual(mockData)
    })
  })

  describe('getById', () => {
    it('should fetch entity by id', async () => {
      const mockData = { id: 1, name: 'test1' }
      mockFetchWithErrorHandling.mockResolvedValueOnce(mockData)

      const result = await testAPI.getById(1)

      expect(mockFetchWithErrorHandling).toHaveBeenCalledWith('/api/test/1')
      expect(result).toEqual(mockData)
    })

    it('should handle string ids', async () => {
      const mockData = { id: 1, name: 'test1' }
      mockFetchWithErrorHandling.mockResolvedValueOnce(mockData)

      await testAPI.getById('1')

      expect(mockFetchWithErrorHandling).toHaveBeenCalledWith('/api/test/1')
    })
  })

  describe('create', () => {
    it('should create new entity', async () => {
      const createData = { name: 'new test' }
      const mockResponse = { id: 3, name: 'new test' }
      mockFetchWithErrorHandling.mockResolvedValueOnce(mockResponse)

      const result = await testAPI.create(createData)

      expect(mockFetchWithErrorHandling).toHaveBeenCalledWith('/api/test', 'POST', createData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('update', () => {
    it('should update existing entity', async () => {
      const updateData = { name: 'updated test' }
      const mockResponse = { id: 1, name: 'updated test' }
      mockFetchWithErrorHandling.mockResolvedValueOnce(mockResponse)

      const result = await testAPI.update(1, updateData)

      expect(mockFetchWithErrorHandling).toHaveBeenCalledWith('/api/test/1', 'PUT', updateData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('delete', () => {
    it('should delete entity', async () => {
      const mockResponse = { success: true }
      mockFetchWithErrorHandling.mockResolvedValueOnce(mockResponse)

      const result = await testAPI.delete(1)

      expect(mockFetchWithErrorHandling).toHaveBeenCalledWith('/api/test/1', 'DELETE')
      expect(result).toEqual(mockResponse)
    })
  })
})
