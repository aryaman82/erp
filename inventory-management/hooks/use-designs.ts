"use client"

import { useState, useEffect, useCallback } from "react"
import { designsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { CupDesign, PrintLabel } from "@/types/inventory"

// Helper to format design data from API to frontend format
const formatDesign = (design: any): CupDesign => ({
  ...design,
  print_labels: design.print_labels || [],
});

export function useDesigns() {
  const { toast } = useToast()
  const [designs, setDesigns] = useState<CupDesign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDesigns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await designsApi.getAll()
      const formattedDesigns = data.map(formatDesign)
      setDesigns(formattedDesigns)
    } catch (err) {
      const e = err as Error
      setError(e)
      toast({
        title: "Failed to load designs",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDesigns()
  }, [fetchDesigns])

  const addDesign = async (designData: Partial<CupDesign>) => {
    try {
      const newDesign = await designsApi.create(designData)
      setDesigns((prev) => [...prev, formatDesign(newDesign)])
      toast({
        title: "Design added successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to add design",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updateDesign = async (id: number, designData: Partial<CupDesign>) => {
    try {
      const updatedDesign = await designsApi.update(id, designData)
      setDesigns((prev) =>
        prev.map((d) => (d.design_id === id ? formatDesign(updatedDesign) : d))
      )
      toast({
        title: "Design updated successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to update design",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const deleteDesign = async (id: number) => {
    try {
      await designsApi.delete(id)
      setDesigns((prev) => prev.filter((d) => d.design_id !== id))
      toast({
        title: "Design deleted successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to delete design",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const addPrintLabel = async (designId: number, labelData: Partial<PrintLabel>) => {
    try {
      const newLabel = await designsApi.addPrintLabel(designId, labelData as any)
      const updatedDesign = await designsApi.get(designId) // Refetch the design to get the full updated labels list
      setDesigns((prev) =>
        prev.map((d) => (d.design_id === designId ? formatDesign(updatedDesign) : d))
      )
      toast({
        title: "Print label added successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to add print label",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updatePrintLabel = async (designId: number, labelId: number, labelData: Partial<PrintLabel>) => {
    try {
      await designsApi.updatePrintLabel(designId, labelId, labelData)
      const updatedDesign = await designsApi.get(designId)
      setDesigns((prev) =>
        prev.map((d) => (d.design_id === designId ? formatDesign(updatedDesign) : d))
      )
      toast({
        title: "Print label updated successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to update print label",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const deletePrintLabel = async (designId: number, labelId: number) => {
    try {
      await designsApi.deletePrintLabel(designId, labelId)
      const updatedDesign = await designsApi.get(designId)
      setDesigns((prev) =>
        prev.map((d) => (d.design_id === designId ? formatDesign(updatedDesign) : d))
      )
      toast({
        title: "Print label deleted successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to delete print label",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return {
    designs,
    loading,
    error,
    fetchDesigns,
    addDesign,
    updateDesign,
    deleteDesign,
    addPrintLabel,
    updatePrintLabel,
    deletePrintLabel,
  }
}
