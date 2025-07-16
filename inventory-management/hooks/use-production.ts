"use client"

import { useState, useEffect, useCallback } from "react"
import { productionApi, transactionsApi, batchesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { ProductionRun } from "@/types/inventory"

export function useProduction() {
  const { toast } = useToast()
  const [productionRuns, setProductionRuns] = useState<ProductionRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProductionRuns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productionApi.getAll()
      setProductionRuns(data)
    } catch (err) {
      const e = err as Error
      setError(e)
      toast({
        title: "Failed to load production runs",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchProductionRuns()
  }, [fetchProductionRuns])

  const addProductionRun = async (runData: Partial<ProductionRun>) => {
    if (!runData.reference || !runData.input_material || !runData.output_material) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newRunData: Omit<ProductionRun, 'run_id' | 'output_quantity' | 'efficiency' | 'status' | 'end_time'> = {
      reference: runData.reference,
      input_material: runData.input_material,
      output_material: runData.output_material,
      input_quantity: runData.input_quantity || 0,
      expected_output: runData.expected_output || 0,
      operator: runData.operator || "Unknown",
      start_time: runData.start_time || new Date().toISOString(),
    };

    try {
      const newRun = await productionApi.create(newRunData);
      setProductionRuns(prev => [newRun, ...prev]);
      toast({
        title: "Production Run Created",
        description: `Run ${newRun.reference} has been successfully created.`,
      });

      // Automatically create a transaction for the input material
      await transactionsApi.create({
        type: 'usage',
        material_id: 0, // This should be resolved to a real material_id
        quantity: newRun.input_quantity,
        reference_id: `prod-${newRun.run_id}`,
        notes: `Input for production run ${newRun.reference}`,
        transaction_date: newRun.start_time,
      });
      toast({
        title: "Usage Transaction Created",
        description: `Transaction for input material of run ${newRun.reference} created.`,
      });

    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to create production run",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updateProductionRun = async (id: number, runData: Partial<ProductionRun>) => {
    try {
      const updatedRun = await productionApi.update(id, runData)
      setProductionRuns(prev => prev.map(r => (r.run_id === id ? updatedRun : r)))
      toast({
        title: "Production Run Updated",
        description: `Run ${updatedRun.reference} has been successfully updated.`,
      })

      if (updatedRun.status === 'completed') {
        // Create a transaction for the output material
        await transactionsApi.create({
          type: 'in', // Changed from 'production' to 'in'
          material_id: 0, // This should be resolved to a real material_id
          quantity: updatedRun.output_quantity,
          reference_id: `prod-${updatedRun.run_id}`,
          notes: `Output from production run ${updatedRun.reference}`,
          transaction_date: updatedRun.end_time || new Date().toISOString(),
        });

        // Create a new batch for the output material
        await batchesApi.create({
            material_id: 0, // This should be resolved to a real material_id
            batch_number: `BATCH-${updatedRun.reference}`,
            material_name: updatedRun.output_material,
            quantity: updatedRun.output_quantity,
            production_date: updatedRun.end_time?.split('T')[0] || new Date().toISOString().split('T')[0],
            status: 'active',
        });
        toast({
            title: "Production Complete",
            description: `Output transaction and batch created for ${updatedRun.reference}.`,
        });
      }
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to update production run",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const deleteProductionRun = async (id: number) => {
    try {
      await productionApi.delete(id)
      setProductionRuns(prev => prev.filter(r => r.run_id !== id))
      toast({
        title: "Production Run Deleted",
        description: `The production run has been successfully deleted.`,
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to delete production run",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return { productionRuns, loading, error, addProductionRun, updateProductionRun, deleteProductionRun, fetchProductionRuns }
}
