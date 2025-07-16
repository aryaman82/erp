"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Palette, FileText, Coffee, Loader2 } from "lucide-react"
import { useDesigns } from "@/hooks/use-designs"
import type { CupDesign, PrintLabel } from "@/types/inventory"

export default function DesignsPage() {
  const {
    designs,
    loading,
    addDesign,
    updateDesign,
    deleteDesign,
    addPrintLabel,
    updatePrintLabel,
    deletePrintLabel,
  } = useDesigns()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<CupDesign | null>(null)
  const [editingDesign, setEditingDesign] = useState<Partial<CupDesign> | null>(null)
  const [editingLabel, setEditingLabel] = useState<Partial<PrintLabel> | null>(null)
  const [designToDelete, setDesignToDelete] = useState<CupDesign | null>(null)

  const handleAddEditDesign = async (designData: Partial<CupDesign>) => {
    if (editingDesign?.design_id) {
      await updateDesign(editingDesign.design_id, designData)
    } else {
      await addDesign(designData)
    }
    setIsAddEditDialogOpen(false)
    setEditingDesign(null)
  }

  const handleDeleteDesign = async (id: number) => {
    await deleteDesign(id)
    setDesignToDelete(null)
  }

  const handleAddEditLabel = async (labelData: Partial<PrintLabel>) => {
    if (!selectedDesign) return

    if (editingLabel?.label_id) {
      await updatePrintLabel(selectedDesign.design_id, editingLabel.label_id, labelData)
    } else {
      await addPrintLabel(selectedDesign.design_id, labelData)
    }
    setIsLabelDialogOpen(false)
    setEditingLabel(null)
  }

  const handleDeleteLabel = async (labelId: number) => {
    if (!selectedDesign) return
    await deletePrintLabel(selectedDesign.design_id, labelId)
  }

  const statusOptions = ["all", "active", "inactive", "draft"]

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (design.description && design.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || design.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openAddDialog = () => {
    setEditingDesign({})
    setIsAddEditDialogOpen(true)
  }

  const openEditDialog = (design: CupDesign) => {
    setEditingDesign(design)
    setIsAddEditDialogOpen(true)
  }

  const openLabelDialog = (design: CupDesign) => {
    setSelectedDesign(design)
    setEditingLabel({})
    setIsLabelDialogOpen(true)
  }

  const openEditLabelDialog = (design: CupDesign, label: PrintLabel) => {
    setSelectedDesign(design)
    setEditingLabel(label)
    setIsLabelDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="mr-2" />
              Cup Designs Management
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add New Design
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Base Material</TableHead>
                <TableHead>Target Weight (g)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Print Labels</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDesigns.map((design) => (
                <TableRow key={design.design_id}>
                  <TableCell className="font-medium">{design.name}</TableCell>
                  <TableCell>{design.base_cup_material}</TableCell>
                  <TableCell>{design.target_weight_g}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(design.status)}>{design.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDesign(design)}>
                      View ({design.print_labels?.length || 0})
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(design)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setDesignToDelete(design)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        {designToDelete && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Design</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to delete the design "{designToDelete.name}"?</p>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setDesignToDelete(null)}>Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDeleteDesign(designToDelete.design_id)}>Delete</Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Design Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDesign?.design_id ? "Edit Design" : "Add New Design"}</DialogTitle>
          </DialogHeader>
          <DesignForm
            initialData={editingDesign}
            onSubmit={handleAddEditDesign}
            onCancel={() => setIsAddEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Print Labels Dialog */}
      {selectedDesign && (
        <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Print Labels for "{selectedDesign.name}"</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => openLabelDialog(selectedDesign)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Label
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Print Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDesign.print_labels?.map((label) => (
                  <TableRow key={label.label_id}>
                    <TableCell>{label.version}</TableCell>
                    <TableCell>{new Date(label.print_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={label.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {label.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{label.notes}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditLabelDialog(selectedDesign, label)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLabel(label.label_id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Label Dialog */}
      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLabel?.label_id ? "Edit Print Label" : "Add New Print Label"}</DialogTitle>
          </DialogHeader>
          <PrintLabelForm
            initialData={editingLabel}
            onSubmit={handleAddEditLabel}
            onCancel={() => setIsLabelDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DesignForm({ initialData, onSubmit, onCancel }: { initialData: Partial<CupDesign> | null, onSubmit: (data: Partial<CupDesign>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(initialData || {})

  useEffect(() => {
    setFormData(initialData || {})
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Design Name</Label>
        <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="base_cup_material">Base Cup Material</Label>
        <Input id="base_cup_material" name="base_cup_material" value={formData.base_cup_material || ""} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="target_weight_g">Target Weight (g)</Label>
        <Input id="target_weight_g" name="target_weight_g" type="number" value={formData.target_weight_g || ""} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status || "draft"} onValueChange={(value) => handleSelectChange("status", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

function PrintLabelForm({ initialData, onSubmit, onCancel }: { initialData: Partial<PrintLabel> | null, onSubmit: (data: Partial<PrintLabel>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(initialData || {})

  useEffect(() => {
    setFormData(initialData || {})
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="version">Version</Label>
        <Input id="version" name="version" value={formData.version || ""} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="print_date">Print Date</Label>
        <Input id="print_date" name="print_date" type="date" value={formData.print_date ? new Date(formData.print_date).toISOString().split('T')[0] : ""} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status || "active"} onValueChange={(value) => handleSelectChange("status", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
