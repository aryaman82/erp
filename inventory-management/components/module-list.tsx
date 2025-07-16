"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react"
import type { ModuleConfig } from "@/types/system"

interface ModuleListProps {
  modules: ModuleConfig[]
  onToggle: (id: string) => void
  onEdit: (module: ModuleConfig) => void
  onRemove: (id: string) => void
}

export function ModuleList({ modules, onToggle, onEdit, onRemove }: ModuleListProps) {
  return (
    <div className="space-y-4">
      {modules
        .sort((a, b) => a.order - b.order)
        .map((module) => (
          <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-500">#{module.order}</span>
                {module.enabled ? (
                  <Eye className="w-4 h-4 text-green-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{module.name}</h4>
                  <Badge variant="outline">{module.icon}</Badge>
                </div>
                <p className="text-sm text-gray-600">{module.description}</p>
                <p className="text-xs text-gray-500">{module.path}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={module.enabled}
                onCheckedChange={() => onToggle(module.id)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(module)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(module.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}
