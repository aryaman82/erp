"use client"

import { useState, useEffect, useCallback } from 'react'
import { customersApi } from '@/lib/api'
import { Customer } from '@/types/inventory'
import { useToast } from '@/hooks/use-toast'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await customersApi.getAll()
      setCustomers(data)
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to fetch customers.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer = await customersApi.create(customer)
      setCustomers(prev => [...prev, newCustomer])
      toast({
        title: "Success",
        description: "Customer added successfully.",
      })
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to add customer.",
        variant: "destructive",
      })
    }
  }

  const updateCustomer = async (id: number, customer: Partial<Omit<Customer, 'id' | 'createdAt'>>) => {
    try {
      const updatedCustomer = await customersApi.update(id, customer)
      setCustomers(prev => prev.map(c => (c.id === id ? updatedCustomer : c)))
      toast({
        title: "Success",
        description: "Customer updated successfully.",
      })
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to update customer.",
        variant: "destructive",
      })
    }
  }

  const deleteCustomer = async (id: number) => {
    try {
      await customersApi.delete(id)
      setCustomers(prev => prev.filter(c => c.id !== id))
      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      })
    } catch (e) {
      setError(e as Error)
      toast({
        title: "Error",
        description: "Failed to delete customer.",
        variant: "destructive",
      })
    }
  }

  return { customers, loading, error, addCustomer, updateCustomer, deleteCustomer, fetchCustomers }
}
