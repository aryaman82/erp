// lib/entity-api-factory.ts
import { fetchWithErrorHandling } from './api-client'

export interface EntityAPI<T> {
  getAll(): Promise<T[]>
  getById(id: string | number): Promise<T>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: string | number, data: Partial<T>): Promise<T>
  delete(id: string | number): Promise<{ success: boolean }>
}

export function createEntityAPI<T>(entityName: string): EntityAPI<T> {
  const basePath = `/api/${entityName}`

  return {
    async getAll(): Promise<T[]> {
      return fetchWithErrorHandling<T[]>(basePath)
    },

    async getById(id: string | number): Promise<T> {
      return fetchWithErrorHandling<T>(`${basePath}/${id}`)
    },

    async create(data: Omit<T, 'id'>): Promise<T> {
      return fetchWithErrorHandling<T>(basePath, 'POST', data)
    },

    async update(id: string | number, data: Partial<T>): Promise<T> {
      return fetchWithErrorHandling<T>(`${basePath}/${id}`, 'PUT', data)
    },

    async delete(id: string | number): Promise<{ success: boolean }> {
      return fetchWithErrorHandling<{ success: boolean }>(`${basePath}/${id}`, 'DELETE')
    }
  }
}
