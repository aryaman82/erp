"use client"

import { useState } from "react"
import type { ModuleConfig } from "@/types/system"
import { useSystem } from "@/contexts/SystemContext"
import { toast } from "@/hooks/use-toast"

export function useModuleManager() {
  const { config, addModule: addSystemModule, updateModule: updateSystemModule, removeModule: removeSystemModule, toggleModule: toggleSystemModule } = useSystem()
  
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleConfig | null>(null)
  const [newModule, setNewModule] = useState<Partial<ModuleConfig>>({
    name: "",
    path: "",
    icon: "Package",
    description: "",
    enabled: true,
    order: config.modules.length,
  })

  const handleAddModule = () => {
    if (!newModule.name || !newModule.path) {
      toast({
        title: "Missing Fields",
        description: "Module Name and Path are required.",
        variant: "destructive",
      })
      return
    }

    const moduleConfig: ModuleConfig = {
      id: newModule.name.toLowerCase().replace(/\s+/g, "-"),
      name: newModule.name,
      path: newModule.path,
      icon: newModule.icon || "Package",
      description: newModule.description || "",
      enabled: newModule.enabled ?? true,
      order: newModule.order ?? config.modules.length,
    }

    addSystemModule(moduleConfig)
    toast({
      title: "Module Added",
      description: `Module "${moduleConfig.name}" has been added.`,
    })
    setNewModule({
      name: "",
      path: "",
      icon: "Package",
      description: "",
      enabled: true,
      order: config.modules.length + 1,
    })
    setIsAddModuleOpen(false)
  }

  const handleEditModule = () => {
    if (!editingModule) return
    updateSystemModule(editingModule.id, editingModule)
    toast({
      title: "Module Updated",
      description: `Module "${editingModule.name}" has been updated.`,
    })
    setEditingModule(null)
  }

  const removeModule = (moduleId: string) => {
    const moduleToRemove = config.modules.find(m => m.id === moduleId)
    removeSystemModule(moduleId)
    if (moduleToRemove) {
      toast({
        title: "Module Removed",
        description: `Module "${moduleToRemove.name}" has been removed.`,
      })
    }
  }

  const toggleModule = (moduleId: string) => {
    const moduleToToggle = config.modules.find(m => m.id === moduleId)
    toggleSystemModule(moduleId)
    if (moduleToToggle) {
      toast({
        title: "Module Status Updated",
        description: `Module "${moduleToToggle.name}" has been ${!moduleToToggle.enabled ? 'enabled' : 'disabled'}.`,
      })
    }
  }

  return {
    isAddModuleOpen,
    setIsAddModuleOpen,
    editingModule,
    setEditingModule,
    newModule,
    setNewModule,
    handleAddModule,
    handleEditModule,
    removeModule,
    toggleModule,
    modules: config.modules,
  }
}
