"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMaterials } from "@/hooks/use-materials"
import { Batch, InventoryItem } from "@/types/inventory"

interface BatchDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (batch: Partial<Batch>) => void
  editingBatch: Partial<Batch> | null
}

export function BatchDialog({ isOpen, onOpenChange, onSave, editingBatch }: BatchDialogProps) {
  const [formData, setFormData] = useState<Partial<Batch>>({})
  const { materials, loading: materialsLoading } = useMaterials()

  useEffect(() => {
    setFormData(editingBatch || {})
  }, [editingBatch])

  const handleMaterialChange = (materialId: string) => {
    const selectedMaterial = materials.find((m) => m.material_id === parseInt(materialId))
    if (selectedMaterial) {
      setFormData({
        ...formData,
        material_id: selectedMaterial.material_id,
        material_name: selectedMaterial.material_name,
        material_type: selectedMaterial.material_type,
      })
    }
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingBatch?.batch_id ? "Edit Batch" : "Add New Batch"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch-number">Batch Number *</Label>
              <Input
                id="batch-number"
                placeholder="e.g., BATCH-2025-001"
                value={formData.batch_number || ""}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="material-select">Material *</Label>
              <Select
                value={formData.material_id?.toString() || ""}
                onValueChange={handleMaterialChange}
                disabled={materialsLoading}
              >
                <SelectTrigger id="material-select">
                  <SelectValue placeholder={materialsLoading ? "Loading..." : "Select material"} />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.material_id} value={material.material_id.toString()}>
                      {material.material_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g., 1000"
                value={formData.quantity || ""}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" placeholder="e.g., kg" value={formData.unit || ""} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="production-date">Production Date *</Label>
            <Input
              id="production-date"
              type="date"
              value={formData.production_date ? new Date(formData.production_date).toISOString().split("T")[0] : ""}
              onChange={(e) => setFormData({ ...formData, production_date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || "active"}
              onValueChange={(value) => setFormData({ ...formData, status: value as Batch["status"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Batch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
