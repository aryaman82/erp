import { ProductionRun } from "@/types/inventory";

// API utility functions for communicating with the backend

const API_BASE_URL = '/api'

// Generic API error handler
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Materials API
export const materialsApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/materials`)
    return handleApiResponse(response)
  },

  async create(material: {
    name: string
    type?: string
    description?: string
    unit?: string
    current_stock?: number
    reorder_level?: number
    cost_per_unit?: number
    supplier?: string
    specifications?: any
  }) {
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material),
    })
    return handleApiResponse(response)
  },

  async update(id: number, material: {
    name?: string
    type?: string
    description?: string
    unit?: string
    current_stock?: number
    reorder_level?: number
    cost_per_unit?: number
    supplier?: string
    specifications?: any
  }) {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material),
    })
    return handleApiResponse(response)
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  },
}

// Batches API
export const batchesApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/batches`)
    return handleApiResponse(response)
  },

  async create(batch: {
    material_id: number
    batch_number: string
    material_name: string
    quantity: number
    unit?: string
    production_date?: string
    status?: 'active' | 'completed' | 'in_progress'
    notes?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    })
    return handleApiResponse(response)
  },

  async update(id: number, batch: {
    batch_number?: string
    material_name?: string
    quantity?: number
    unit?: string
    production_date?: string
    status?: 'active' | 'completed' | 'in_progress'
    notes?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    })
    return handleApiResponse(response)
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  },
}

// Customers API
export const customersApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/customers`)
    return handleApiResponse(response)
  },

  async create(customer: {
    name: string
    email?: string
    phone?: string
    address?: string
    company?: string
    status?: 'active' | 'inactive' | 'pending'
  }) {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    })
    return handleApiResponse(response)
  },

  async update(id: number, customer: {
    name?: string
    email?: string
    phone?: string
    address?: string
    company?: string
    status?: 'active' | 'inactive' | 'pending'
  }) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    })
    return handleApiResponse(response)
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  },
}

// System Configuration API
export const systemConfigApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/system-config`)
    return handleApiResponse(response)
  },

  async update(key: string, value: any, description?: string) {
    const response = await fetch(`${API_BASE_URL}/system-config/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value, description }),
    })
    return handleApiResponse(response)
  },
}

// Transactions API
export const transactionsApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/transactions`)
    return handleApiResponse(response)
  },

  async create(transaction: {
    type: 'in' | 'out' | 'adjust' | 'convert' | 'usage'
    material_id: number
    quantity: number
    reference_id?: string
    notes?: string
    transaction_date?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })
    return handleApiResponse(response)
  },

  async update(id: number, transaction: {
    type?: 'in' | 'out' | 'adjust' | 'convert' | 'usage'
    material_id?: number
    quantity?: number
    reference_id?: string
    notes?: string
    transaction_date?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })
    return handleApiResponse(response)
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  },
}

// Designs API
export const designsApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/designs`)
    return handleApiResponse(response)
  },

  async get(id: number) {
    const response = await fetch(`${API_BASE_URL}/designs/${id}`)
    return handleApiResponse(response)
  },

  async create(design: {
    name: string
    base_cup_material: string
    description?: string
    target_weight_g?: number
    status?: 'active' | 'inactive' | 'draft'
  }) {
    const response = await fetch(`${API_BASE_URL}/designs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    })
    return handleApiResponse(response)
  },

  async update(id: number, design: Partial<{
    name: string
    base_cup_material: string
    description: string
    target_weight_g: number
    status: 'active' | 'inactive' | 'draft'
  }>) {
    const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    })
    return handleApiResponse(response)
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  },

  async addPrintLabel(designId: number, label: {
    version: string
    print_date: string
    notes?: string
    status?: 'active' | 'archived'
  }) {
    const response = await fetch(`${API_BASE_URL}/designs/${designId}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    })
    return handleApiResponse(response)
  },

  async updatePrintLabel(designId: number, labelId: number, label: Partial<{
    version: string
    print_date: string
    notes: string
    status: 'active' | 'archived'
  }>) {
    const response = await fetch(`${API_BASE_URL}/designs/${designId}/labels/${labelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    })
    return handleApiResponse(response)
  },

  async deletePrintLabel(designId: number, labelId: number) {
    const response = await fetch(`${API_BASE_URL}/designs/${designId}/labels/${labelId}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  }
}

// Dashboard API
export const dashboardApi = {
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`)
    return handleApiResponse(response)
  },
  async getRecentActivity() {
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-activity`)
    return handleApiResponse(response)
  },
  async getLowStockItems() {
    const response = await fetch(`${API_BASE_URL}/dashboard/low-stock`)
    return handleApiResponse(response)
  },
}

// Production API
export const productionApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/production`)
    return handleApiResponse(response)
  },

  async create(productionRun: {
    reference: string
    input_material: string
    output_material: string
    input_quantity: number
    expected_output: number
    operator: string
    start_time: string
  }) {
    const response = await fetch(`${API_BASE_URL}/production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productionRun),
    })
    return handleApiResponse(response)
  },

  async updateStatus(id: number, updates: {
    status?: 'planned' | 'in_progress' | 'completed' | 'paused'
    output_quantity?: number
    end_time?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/production/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    return handleApiResponse(response)
  },

  async update(id: number, productionRun: Partial<ProductionRun>) {
    const response = await fetch(`${API_BASE_URL}/production/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productionRun),
    })
    return handleApiResponse(response)
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/production/${id}`, {
      method: 'DELETE',
    })
    return handleApiResponse(response)
  },
}
