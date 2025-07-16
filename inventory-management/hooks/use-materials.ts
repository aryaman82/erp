"use client"

import { useState, useEffect, useCallback } from "react"
import { materialsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { InventoryItem } from "@/types/inventory"

// Helper to format material data from API to frontend format
const formatMaterial = (material: any): InventoryItem => ({
  inventory_id: material.material_id,
  material_id: material.material_id,
  material_name: material.name,
  material_type: material.type || 'raw_material',
  unit: material.unit,
  current_quantity: material.current_stock || 0,
  last_updated: material.updated_at || new Date().toISOString(),
  specifications: material.specifications || {},
});

export function useMaterials() {
  const { toast } = useToast()
  const [materials, setMaterials] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await materialsApi.getAll()
      const formattedMaterials = data.map(formatMaterial)
      setMaterials(formattedMaterials)
    } catch (err) {
      const e = err as Error
      setError(e)
      toast({
        title: "Failed to load materials",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const addMaterial = async (materialData: Partial<InventoryItem>) => {
    try {
      const createData = {
        name: materialData.material_name!,
        type: materialData.material_type,
        unit: materialData.unit,
        current_stock: materialData.current_quantity,
        specifications: materialData.specifications,
      }
      const newMaterial = await materialsApi.create(createData)
      setMaterials((prev) => [...prev, formatMaterial(newMaterial)])
      toast({
        title: "Material added successfully",
        description: `${newMaterial.name} has been added to the inventory.`,
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to add material",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updateMaterial = async (id: number, materialData: Partial<InventoryItem>) => {
    try {
      const updateData = {
        name: materialData.material_name,
        type: materialData.material_type,
        unit: materialData.unit,
        current_stock: materialData.current_quantity,
        specifications: materialData.specifications,
      }
      const updatedMaterial = await materialsApi.update(id, updateData)
      setMaterials((prev) =>
        prev.map((m) => (m.material_id === id ? formatMaterial(updatedMaterial) : m))
      )
      toast({
        title: "Material updated successfully",
        description: `${updatedMaterial.name} has been updated.`,
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to update material",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const deleteMaterial = async (id: number) => {
    try {
      await materialsApi.delete(id)
      setMaterials((prev) => prev.filter((m) => m.material_id !== id))
      toast({
        title: "Material deleted successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to delete material",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return { materials, loading, error, addMaterial, updateMaterial, deleteMaterial, fetchMaterials }
}
