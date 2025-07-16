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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, ArrowRightLeft, ArrowUp, ArrowDown, RefreshCw, Factory, FileText, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import type { Transaction } from "../../types/inventory"
import { useTransactions } from "@/hooks/use-transactions"
import { useToast } from "@/hooks/use-toast"

const getTransactionTypeIcon = (type: string) => {
  switch (type) {
    case "in":
      return <ArrowDown className="h-4 w-4 text-green-500" />
    case "out":
      return <ArrowUp className="h-4 w-4 text-red-500" />
    case "adjust":
      return <RefreshCw className="h-4 w-4 text-blue-500" />
    case "convert":
      return <Factory className="h-4 w-4 text-purple-500" />
    case "usage":
        return <RefreshCw className="h-4 w-4 text-yellow-500" />
    default:
      return <ArrowRightLeft className="h-4 w-4" />
  }
}

export default function TransactionsPage() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const searchTermLower = searchTerm.toLowerCase()
        return (
          t.reference_id?.toLowerCase().includes(searchTermLower) ||
          t.notes?.toLowerCase().includes(searchTermLower) ||
          t.transaction_id.toString().includes(searchTermLower)
        )
      })
      .filter(t => typeFilter === "all" || t.type === typeFilter)
      .filter(t => {
        if (dateFilter === "all") return true
        const transactionDate = new Date(t.transaction_date)
        const now = new Date()
        if (dateFilter === "today") {
          return transactionDate.toDateString() === now.toDateString()
        }
        if (dateFilter === "week") {
          const oneWeekAgo = new Date(now.setDate(now.getDate() - 7))
          return transactionDate >= oneWeekAgo
        }
        if (dateFilter === "month") {
          const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1))
          return transactionDate >= oneMonthAgo
        }
        return true
      })
  }, [transactions, searchTerm, typeFilter, dateFilter])

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsAddEditDialogOpen(true)
  }

  const openDeleteDialog = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
  }

  const closeDeleteDialog = () => {
    setTransactionToDelete(null)
  }

  const handleSave = async (formData: Partial<Transaction>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.transaction_id, formData)
    } else {
      await addTransaction(formData)
    }
    setIsAddEditDialogOpen(false)
    setEditingTransaction(null)
  }

  const handleDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction(transactionToDelete.transaction_id)
      closeDeleteDialog()
    }
  }

  const transactionTypes = useMemo(() =>
    [...new Set(transactions.map(t => t.type))].filter(Boolean)
  , [transactions])

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <ArrowRightLeft className="mr-3 h-10 w-10" />
          Inventory Transactions
        </h1>
        <p className="text-muted-foreground mt-2">
          A complete log of all inventory movements and adjustments.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by reference, notes..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {transactionTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AddEditTransactionDialog
              isOpen={isAddEditDialogOpen}
              setIsOpen={setIsAddEditDialogOpen}
              editingTransaction={editingTransaction}
              setEditingTransaction={setEditingTransaction}
              onSave={handleSave}
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </AddEditTransactionDialog>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(transaction => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit">
                        {getTransactionTypeIcon(transaction.type)}
                        <span className="ml-2 capitalize">{transaction.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{transaction.reference_id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-xs">
                      {transaction.notes}
                    </TableCell>
                    <TableCell>{new Date(transaction.transaction_date).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(transaction)}>
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
      <Dialog open={!!transactionToDelete} onOpenChange={() => closeDeleteDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete transaction{" "}
            <strong>{transactionToDelete?.reference_id}</strong>? This action cannot be undone.
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

function AddEditTransactionDialog({
  children,
  isOpen,
  setIsOpen,
  editingTransaction,
  setEditingTransaction,
  onSave,
}: {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  editingTransaction: Transaction | null
  setEditingTransaction: (transaction: Transaction | null) => void
  onSave: (formData: Partial<Transaction>) => void
}) {
  const [formData, setFormData] = useState<Partial<Transaction>>({})

  useEffect(() => {
    if (isOpen && editingTransaction) {
      setFormData(editingTransaction)
    } else if (!isOpen) {
      setFormData({})
      setEditingTransaction(null)
    }
  }, [isOpen, editingTransaction, setEditingTransaction])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
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
          <DialogTitle>{editingTransaction ? "Edit Transaction" : "New Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select name="type" value={formData.type || ""} onValueChange={value => handleSelectChange("type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                  <SelectItem value="adjust">Adjust</SelectItem>
                  <SelectItem value="convert">Convert</SelectItem>
                  <SelectItem value="usage">Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material_id" className="text-right">Material ID</Label>
              <Input id="material_id" name="material_id" type="number" value={formData.material_id || ""} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference_id" className="text-right">Reference</Label>
              <Input id="reference_id" name="reference_id" value={formData.reference_id || ""} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} className="col-span-3" />
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
