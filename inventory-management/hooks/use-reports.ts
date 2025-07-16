"use client"

import { useState, useEffect } from 'react'
import { productionApi, transactionsApi, materialsApi } from '@/lib/api'
import { ProductionRun, Transaction, Material } from '@/types/inventory'

interface ReportMetrics {
  totalProductionRuns: number
  totalUnitsProduced: number
  totalTransactions: number
  materialInventoryCount: number
}

interface ReportsData {
  metrics: ReportMetrics
  recentTransactions: Transaction[]
  productionData: ProductionRun[]
  materialData: Material[]
}

export function useReports() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [productionRuns, transactions, materials] = await Promise.all([
          productionApi.getAll(),
          transactionsApi.getAll(),
          materialsApi.getAll(),
        ])

        const totalProductionRuns = productionRuns.length
        const totalUnitsProduced = productionRuns.reduce((sum: number, run: ProductionRun) => sum + (run.output_quantity || 0), 0)
        const totalTransactions = transactions.length
        const materialInventoryCount = materials.reduce((sum: number, mat: any) => sum + (mat.current_stock || 0), 0)

        setData({
          metrics: {
            totalProductionRuns,
            totalUnitsProduced,
            totalTransactions,
            materialInventoryCount,
          },
          recentTransactions: transactions.slice(0, 5),
          productionData: productionRuns,
          materialData: materials,
        })
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
