"use client"

import { useState, useEffect, useCallback } from 'react'
import { batchesApi } from '@/lib/api'
import { Batch } from '@/types/inventory'
import { useToast } from '@/hooks/use-toast'

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true)
      const data = await batchesApi.getAll()
      setBatches(data)
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to fetch batches.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  const addBatch = async (batch: Omit<Batch, 'batch_id' | 'created_at'>) => {
    try {
      const newBatch = await batchesApi.create(batch)
      setBatches(prev => [...prev, newBatch])
      toast({
        title: "Success",
        description: "Batch added successfully.",
      })
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to add batch.",
        variant: "destructive",
      })
    }
  }

  const updateBatch = async (id: number, batch: Partial<Omit<Batch, 'batch_id' | 'created_at'>>) => {
    try {
      const updatedBatch = await batchesApi.update(id, batch)
      setBatches(prev => prev.map(b => (b.batch_id === id ? updatedBatch : b)))
      toast({
        title: "Success",
        description: "Batch updated successfully.",
      })
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to update batch.",
        variant: "destructive",
      })
    }
  }

  const deleteBatch = async (id: number) => {
    try {
      await batchesApi.delete(id)
      setBatches(prev => prev.filter(b => b.batch_id !== id))
      toast({
        title: "Success",
        description: "Batch deleted successfully.",
      })
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to delete batch.",
        variant: "destructive",
      })
    }
  }

  return { batches, loading, error, addBatch, updateBatch, deleteBatch, fetchBatches }
}
