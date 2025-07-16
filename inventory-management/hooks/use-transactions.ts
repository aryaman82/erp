"use client"

import { useState, useEffect, useCallback } from "react"
import { transactionsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from "@/types/inventory"

export function useTransactions() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionsApi.getAll()
      setTransactions(data)
    } catch (err) {
      const e = err as Error
      setError(e)
      toast({
        title: "Failed to load transactions",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (transactionData: Partial<Transaction>) => {
    if (!transactionData.type || !transactionData.material_id || !transactionData.quantity) {
        toast({
            title: "Missing Fields",
            description: "Type, Material ID, and Quantity are required.",
            variant: "destructive",
        });
        return;
    }
    try {
      const newTransaction = await transactionsApi.create({
        type: transactionData.type,
        material_id: transactionData.material_id,
        quantity: transactionData.quantity,
        reference_id: transactionData.reference_id,
        notes: transactionData.notes,
      })
      setTransactions((prev) => [newTransaction, ...prev])
      toast({
        title: "Transaction created successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to create transaction",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updateTransaction = async (id: number, transactionData: Partial<Transaction>) => {
    try {
      const updatedTransaction = await transactionsApi.update(id, transactionData)
      setTransactions((prev) =>
        prev.map((t) => (t.transaction_id === id ? updatedTransaction : t))
      )
      toast({
        title: "Transaction updated successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to update transaction",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      await transactionsApi.delete(id)
      setTransactions((prev) => prev.filter((t) => t.transaction_id !== id))
      toast({
        title: "Transaction deleted successfully",
      })
    } catch (e) {
      const err = e as Error
      toast({
        title: "Failed to delete transaction",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, fetchTransactions }
}
