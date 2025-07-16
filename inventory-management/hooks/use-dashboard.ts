"use client"

import { useState, useEffect, useCallback } from "react"
import { dashboardApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { DashboardStats } from "@/types/inventory"

export function useDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, activityData, lowStockData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(),
        dashboardApi.getLowStockItems(),
      ])
      setStats(statsData)
      setRecentActivity(activityData)
      setLowStockItems(lowStockData)
    } catch (err) {
      const e = err as Error
      setError(e)
      toast({
        title: "Failed to load dashboard data",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    stats,
    recentActivity,
    lowStockItems,
    loading,
    error,
    refresh: fetchData,
  }
}
