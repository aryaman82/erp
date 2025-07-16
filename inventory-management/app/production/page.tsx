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
import { Progress } from "@/components/ui/progress"
import { Factory, Play, Pause, Square, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Pencil, Trash2, Loader2 } from "lucide-react"
import { ProductionRun } from "@/types/inventory"
import { useProduction } from "@/hooks/use-production"
import { useToast } from "@/hooks/use-toast"

const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "in_progress":
      return "secondary"
    case "planned":
      return "outline"
    case "failed":
      return "destructive"
    default:
      return "secondary"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
    case "in_progress":
      return <Play className="h-4 w-4 mr-2 text-blue-500" />
    case "planned":
      return <Clock className="h-4 w-4 mr-2 text-gray-500" />
    case "failed":
      return <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
    default:
      return <Clock className="h-4 w-4 mr-2" />
  }
}

export default function ProductionPage() {
  const { toast } = useToast()
  const { productionRuns, loading, addProductionRun, updateProductionRun, deleteProductionRun } = useProduction()
  
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [editingRun, setEditingRun] = useState<ProductionRun | null>(null)
  const [runToDelete, setRunToDelete] = useState<ProductionRun | null>(null)

  const openEditDialog = (run: ProductionRun) => {
    setEditingRun(run)
    setIsAddEditDialogOpen(true)
  }

  const openDeleteDialog = (run: ProductionRun) => {
    setRunToDelete(run)
  }

  const closeDeleteDialog = () => {
    setRunToDelete(null)
  }

  const handleSave = async (formData: Partial<ProductionRun>) => {
    if (editingRun) {
      await updateProductionRun(editingRun.run_id, formData)
    } else {
      await addProductionRun(formData)
    }
    setIsAddEditDialogOpen(false)
    setEditingRun(null)
  }

  const handleDelete = async () => {
    if (runToDelete) {
      await deleteProductionRun(runToDelete.run_id)
      closeDeleteDialog()
    }
  }

  const productionStats = useMemo(() => {
    const totalRuns = productionRuns.length
    const completed = productionRuns.filter(r => r.status === 'completed').length
    const inProgress = productionRuns.filter(r => r.status === 'in_progress').length
    const totalOutput = productionRuns.reduce((acc, r) => acc + (r.output_quantity || 0), 0)
    return { totalRuns, completed, inProgress, totalOutput }
  }, [productionRuns])

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Factory className="mr-3 h-10 w-10" />
          Production Control
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage all production runs from start to finish.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionStats.totalRuns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionStats.totalOutput.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-end">
            <AddEditRunDialog
              isOpen={isAddEditDialogOpen}
              setIsOpen={setIsAddEditDialogOpen}
              editingRun={editingRun}
              setEditingRun={setEditingRun}
              onSave={handleSave}
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Production Run
              </Button>
            </AddEditRunDialog>
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
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Output Material</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionRuns.map(run => (
                  <TableRow key={run.run_id}>
                    <TableCell className="font-medium">{run.reference}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(run.status)} className="flex items-center w-fit">
                        {getStatusIcon(run.status)}
                        <span className="capitalize">{run.status.replace("_", " ")}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{run.output_material}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-muted-foreground">
                          {run.output_quantity.toLocaleString()} / {run.expected_output.toLocaleString()}
                        </span>
                        <Progress value={(run.output_quantity / run.expected_output) * 100} className="w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={run.efficiency >= 95 ? "default" : run.efficiency >= 90 ? "secondary" : "destructive"}>
                        {run.efficiency}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(run)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(run)}>
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
      <Dialog open={!!runToDelete} onOpenChange={() => closeDeleteDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete production run{" "}
            <strong>{runToDelete?.reference}</strong>? This action cannot be undone.
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

function AddEditRunDialog({
  children,
  isOpen,
  setIsOpen,
  editingRun,
  setEditingRun,
  onSave,
}: {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  editingRun: ProductionRun | null
  setEditingRun: (run: ProductionRun | null) => void
  onSave: (formData: Partial<ProductionRun>) => void
}) {
  const [formData, setFormData] = useState<Partial<ProductionRun>>({})

  useEffect(() => {
    if (isOpen && editingRun) {
      setFormData(editingRun)
    } else if (!isOpen) {
      setFormData({})
      setEditingRun(null)
    }
  }, [isOpen, editingRun, setEditingRun])

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
          <DialogTitle>{editingRun ? "Edit Production Run" : "New Production Run"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">Reference</Label>
              <Input id="reference" name="reference" value={formData.reference || ""} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="input_material" className="text-right">Input Material</Label>
              <Input id="input_material" name="input_material" value={formData.input_material || ""} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="output_material" className="text-right">Output Material</Label>
              <Input id="output_material" name="output_material" value={formData.output_material || ""} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="input_quantity" className="text-right">Input Qty</Label>
              <Input id="input_quantity" name="input_quantity" type="number" value={formData.input_quantity || ""} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expected_output" className="text-right">Expected Output</Label>
              <Input id="expected_output" name="expected_output" type="number" value={formData.expected_output || ""} onChange={handleChange} className="col-span-3" />
            </div>
            {editingRun && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="output_quantity" className="text-right">Actual Output</Label>
                    <Input id="output_quantity" name="output_quantity" type="number" value={formData.output_quantity || ""} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select name="status" value={formData.status || ""} onValueChange={value => handleSelectChange("status", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="operator" className="text-right">Operator</Label>
              <Input id="operator" name="operator" value={formData.operator || ""} onChange={handleChange} className="col-span-3" />
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
