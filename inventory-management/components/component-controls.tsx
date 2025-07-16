"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette } from "lucide-react"

interface ComponentControlsProps {
  templates: { id: string; name: string }[]
  selectedTemplateId: string
  onTemplateChange: (id: string) => void
  customProps: string
  onCustomPropsChange: (props: string) => void
}

export function ComponentControls({
  templates,
  selectedTemplateId,
  onTemplateChange,
  customProps,
  onCustomPropsChange,
}: ComponentControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Component Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Component</Label>
          <Select value={selectedTemplateId} onValueChange={onTemplateChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Component Props (JSON)</Label>
          <Textarea
            value={customProps}
            onChange={(e) => onCustomPropsChange(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder="Enter valid JSON"
          />
        </div>
      </CardContent>
    </Card>
  )
}
