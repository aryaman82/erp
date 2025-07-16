"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Code } from "lucide-react"
import { ModuleList } from "@/components/module-list"
import { useModuleManager } from "@/hooks/use-module-manager"

export function ModuleManager() {
  const {
    isAddModuleOpen,
    setIsAddModuleOpen,
    newModule,
    setNewModule,
    handleAddModule,
    modules,
    toggleModule,
    handleEditModule,
    removeModule,
  } = useModuleManager()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Module Management
          </CardTitle>
          <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Module</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="module-name">Module Name</Label>
                  <Input
                    id="module-name"
                    value={newModule.name}
                    onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                    placeholder="Quality Control"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module-path">Path</Label>
                  <Input
                    id="module-path"
                    value={newModule.path}
                    onChange={(e) => setNewModule({ ...newModule, path: e.target.value })}
                    placeholder="/quality"
                  />
                </div>
                <Button onClick={handleAddModule}>Save Module</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ModuleList
          modules={modules}
          onToggle={toggleModule}
          onEdit={handleEditModule}
          onRemove={removeModule}
        />
      </CardContent>
    </Card>
  )
}
