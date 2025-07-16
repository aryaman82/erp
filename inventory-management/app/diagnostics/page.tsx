"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Hourglass } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDiagnostics, type DiagnosticResult } from "@/hooks/use-diagnostics"

const getStatusIcon = (status: DiagnosticResult["status"]) => {
  switch (status) {
    case "success":
      return <CheckCircle className="w-6 h-6 text-green-500" />
    case "error":
      return <XCircle className="w-6 h-6 text-red-500" />
    case "warning":
      return <AlertCircle className="w-6 h-6 text-yellow-500" />
    case "pending":
      return <Hourglass className="w-6 h-6 text-gray-500 animate-pulse" />
    default:
      return null
  }
}

const DiagnosticCard = ({ title, result }: { title: string; result: DiagnosticResult }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        {getStatusIcon(result.status)}
      </div>
    </CardHeader>
    <CardContent>
      <p className="font-semibold">{result.message}</p>
      {result.details && (
        <Alert variant={result.status === "error" ? "destructive" : "default"} className="mt-2">
          <AlertDescription className="text-xs break-words">
            {result.details}
          </AlertDescription>
        </Alert>
      )}
      {result.timestamp && (
        <p className="text-xs text-gray-500 mt-2">
          Last run: {new Date(result.timestamp).toLocaleString()}
        </p>
      )}
    </CardContent>
  </Card>
)

export default function DiagnosticsPage() {
  const { results, isRunning, runDiagnostics } = useDiagnostics()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System Diagnostics</h1>
        <Button onClick={runDiagnostics} disabled={isRunning}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running..." : "Run Diagnostics"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DiagnosticCard title="Frontend Health" result={results.frontend} />
        <DiagnosticCard title="Backend API" result={results.backend} />
        <DiagnosticCard title="Database Connection" result={results.database} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overall Status</CardTitle>
          <CardDescription>Summary of system health checks.</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.values(results).every(r => r.status === "success") && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>All systems are operational.</AlertDescription>
            </Alert>
          )}
          {Object.values(results).some(r => r.status === "error") && (
            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>
                One or more systems are experiencing issues. Please check the details above.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
