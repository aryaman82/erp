"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useBatches } from "@/hooks/use-batches"
import { Batch } from "@/types/inventory"
import { BatchStats } from "@/components/batch-stats"
import { BatchFilter } from "@/components/batch-filter"
import { BatchTable } from "@/components/batch-table"
import { BatchDialog } from "@/components/batch-dialog"

export default function BatchesPage() {
  const { batches, loading, error, addBatch, updateBatch, deleteBatch } = useBatches()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Partial<Batch> | null>(null)

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.material_name && batch.material_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSaveBatch = async (formData: Partial<Batch>) => {
    try {
      if (editingBatch?.batch_id) {
        await updateBatch(editingBatch.batch_id, formData)
      } else {
        await addBatch(formData as Omit<Batch, "batch_id" | "created_at">)
      }
      setEditingBatch(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save batch:", error)
      alert("An error occurred while saving the batch. Please try again.")
    }
  }

  const handleDeleteBatch = async (batchId: number) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      try {
        await deleteBatch(batchId)
      } catch (error) {
        console.error("Failed to delete batch:", error)
        alert("An error occurred while deleting the batch. Please try again.")
      }
    }
  }

  const openEditDialog = (batch: Batch) => {
    setEditingBatch(batch)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingBatch({})
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-xl text-gray-600">Loading Batches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Failed to load batches: {error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Production Batches</h1>
          <p className="text-gray-500">Track and manage production batches across the facility.</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Batch
        </Button>
      </div>

      <BatchStats batches={batches} />

      <Card>
        <CardHeader>
          <CardTitle>Batch List</CardTitle>
        </CardHeader>
        <CardContent>
          <BatchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <BatchTable batches={filteredBatches} onEdit={openEditDialog} onDelete={handleDeleteBatch} />
        </CardContent>
      </Card>

      <BatchDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveBatch}
        editingBatch={editingBatch}
      />
    </div>
  )
}
