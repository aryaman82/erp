"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Package, Layers, Coffee, FileText, Filter, Download, Upload, Loader2 } from "lucide-react"
import type { InventoryItem } from "../../types/inventory"
import { useMaterials } from "@/hooks/use-materials"
import { useToast } from "@/hooks/use-toast"

export default function MaterialsPage() {
  const { toast } = useToast()
  const { materials, loading, addMaterial, updateMaterial, deleteMaterial } = useMaterials()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null)

  const filteredMaterials = useMemo(() => {
    return materials
      .filter(material =>
        material.material_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(material =>
        typeFilter === "all" ? true : material.material_type === typeFilter
      )
  }, [materials, searchTerm, typeFilter])

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item)
    setIsAddEditDialogOpen(true)
  }

  const openDeleteDialog = (item: InventoryItem) => {
    setItemToDelete(item)
  }

  const closeDeleteDialog = () => {
    setItemToDelete(null)
  }

  const handleAddOrUpdate = async (formData: Partial<InventoryItem>) => {
    if (!formData.material_name || !formData.material_type || !formData.unit || formData.current_quantity === undefined) {
        toast({
            title: "Missing Fields",
            description: "Please fill in all required fields.",
            variant: "destructive",
        });
        return;
    }

    if (editingItem) {
      await updateMaterial(editingItem.material_id, formData)
    } else {
      await addMaterial(formData)
    }
    setIsAddEditDialogOpen(false)
    setEditingItem(null)
  }

  const handleDelete = async () => {
    if (itemToDelete) {
      await deleteMaterial(itemToDelete.material_id)
      closeDeleteDialog()
    }
  }

  const materialTypes = useMemo(() =>
    [...new Set(materials.map(m => m.material_type))].filter(Boolean)
  , [materials])

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Package className="mr-3 h-10 w-10" />
          Materials Inventory
        </h1>
        <p className="text-muted-foreground mt-2">
          Track, manage, and organize all raw materials, sheets, and finished goods.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {materialTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <AddEditMaterialDialog
                isOpen={isAddEditDialogOpen}
                setIsOpen={setIsAddEditDialogOpen}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                onSave={handleAddOrUpdate}
              >
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </AddEditMaterialDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map(item => (
                  <TableRow key={item.inventory_id}>
                    <TableCell className="font-medium">{item.material_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.material_type?.replace(/_/g, ' ') || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.current_quantity.toLocaleString()}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{new Date(item.last_updated).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!itemToDelete} onOpenChange={() => closeDeleteDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the material{" "}
            <strong>{itemToDelete?.material_name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddEditMaterialDialog({
  children,
  isOpen,
  setIsOpen,
  editingItem,
  setEditingItem,
  onSave,
}: {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  editingItem: InventoryItem | null
  setEditingItem: (item: InventoryItem | null) => void
  onSave: (formData: Partial<InventoryItem>) => void
}) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({})

  useEffect(() => {
    if (isOpen && editingItem) {
      setFormData(editingItem)
    } else if (!isOpen) {
      setFormData({})
      setEditingItem(null)
    }
  }, [isOpen, editingItem, setEditingItem])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Material" : "Add New Material"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material_name" className="text-right">
                Name
              </Label>
              <Input
                id="material_name"
                name="material_name"
                value={formData.material_name || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material_type" className="text-right">
                Type
              </Label>
              <Select
                name="material_type"
                value={formData.material_type || ""}
                onValueChange={value => handleSelectChange("material_type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw_material">Raw Material</SelectItem>
                  <SelectItem value="sheet">Sheet</SelectItem>
                  <SelectItem value="cup">Cup</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current_quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="current_quantity"
                name="current_quantity"
                type="number"
                value={formData.current_quantity || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
