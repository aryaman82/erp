// lib/api-client.ts
export interface APIResponse<T = any> {
  data?: T
  error?: string
  status: number
}

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetchWithErrorHandling<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new APIError(response.status, errorData.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    console.error(`API request failed: ${method} ${url}`, error)
    throw new APIError(500, 'Network error occurred')
  }
}
