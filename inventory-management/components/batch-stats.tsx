"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Factory, CheckCircle, Clock } from "lucide-react"
import { Batch } from "@/types/inventory"

interface BatchStatsProps {
  batches: Batch[]
}

export function BatchStats({ batches }: BatchStatsProps) {
  const totalBatches = batches.length
  const activeBatches = batches.filter((b) => b.status === "active").length
  const completedBatches = batches.filter((b) => b.status === "completed").length
  const inProgressBatches = batches.filter((b) => b.status === "in_progress").length

  const stats = [
    { title: "Total Batches", value: totalBatches, icon: Layers },
    { title: "Active", value: activeBatches, icon: CheckCircle, color: "text-green-600" },
    { title: "In Progress", value: inProgressBatches, icon: Clock, color: "text-yellow-600" },
    { title: "Completed", value: completedBatches, icon: Factory, color: "text-blue-600" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color || ""}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
