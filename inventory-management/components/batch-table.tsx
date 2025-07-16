"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { Batch } from "@/types/inventory"

interface BatchTableProps {
  batches: Batch[]
  onEdit: (batch: Batch) => void
  onDelete: (id: number) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-100"
    case "completed":
      return "text-blue-600 bg-blue-100"
    case "in_progress":
      return "text-yellow-600 bg-yellow-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function BatchTable({ batches, onEdit, onDelete }: BatchTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batch Number</TableHead>
          <TableHead>Material</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Production Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.batch_id}>
            <TableCell className="font-medium">{batch.batch_number}</TableCell>
            <TableCell>{batch.material_name}</TableCell>
            <TableCell>
              {batch.quantity} {batch.unit}
            </TableCell>
            <TableCell>{new Date(batch.production_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(batch)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(batch.batch_id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
