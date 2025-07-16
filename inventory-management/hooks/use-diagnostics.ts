"use client"

import { useState, useCallback } from "react"
import { useToast } from "./use-toast"

export interface DiagnosticResult {
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
  timestamp?: Date
}

export interface DiagnosticResults {
  frontend: DiagnosticResult
  backend: DiagnosticResult
  database: DiagnosticResult
}

const initialResults: DiagnosticResults = {
  frontend: { status: "pending", message: "Waiting to run..." },
  backend: { status: "pending", message: "Waiting to run..." },
  database: { status: "pending", message: "Waiting to run..." },
}

export function useDiagnostics() {
  const { toast } = useToast()
  const [results, setResults] = useState<DiagnosticResults>(initialResults)
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true)
    setResults(initialResults)
    toast({
      title: "Running Diagnostics",
      description: "Please wait while we check the system status.",
    })

    const runCheck = async (
      key: keyof DiagnosticResults,
      check: () => Promise<Omit<DiagnosticResult, "timestamp">>,
    ) => {
      setResults(prev => ({
        ...prev,
        [key]: { status: "pending", message: "Running..." },
      }))
      try {
        const result = await check()
        setResults(prev => ({
          ...prev,
          [key]: { ...result, timestamp: new Date() },
        }))
      } catch (error) {
        setResults(prev => ({
          ...prev,
          [key]: {
            status: "error",
            message: "Check failed",
            details: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date(),
          },
        }))
      }
    }

    await runCheck("frontend", async () => {
      if (typeof window !== "undefined" && document) {
        return {
          status: "success",
          message: "Frontend is operational",
          details: "React app loaded successfully, DOM available",
        }
      }
      throw new Error("Window or document not available.")
    })

    await runCheck("backend", async () => {
      const res = await fetch("/api/health")
      if (!res.ok) throw new Error(`API returned status ${res.status}`)
      const data = await res.json()
      return {
        status: "success",
        message: "Backend API is responsive",
        details: `API version: ${data.version}, Status: ${data.status}`,
      }
    })

    await runCheck("database", async () => {
      const res = await fetch("/api/db-health")
      if (!res.ok) throw new Error(`API returned status ${res.status}`)
      const data = await res.json()
      if (data.status !== "ok") throw new Error(data.message)
      return {
        status: "success",
        message: "Database connection is healthy",
        details: `PostgreSQL is connected and responsive.`,
      }
    })

    setIsRunning(false)
    toast({
      title: "Diagnostics Complete",
      description: "System status checks are finished.",
    })
  }, [toast])

  return { results, isRunning, runDiagnostics }
}
