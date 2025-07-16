"use client"

import { ComponentControls } from "@/components/component-controls"
import { ComponentPreview } from "@/components/component-preview"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from "lucide-react"
import { useVisualEditor } from "@/hooks/use-visual-editor"

export default function VisualEditorPage() {
  const {
    templates,
    selectedTemplate,
    handleTemplateChange,
    customProps,
    setCustomProps,
    renderedComponent,
  } = useVisualEditor()

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Controls Column */}
      <div className="lg:col-span-1 space-y-6">
        <ComponentControls
          templates={templates}
          selectedTemplateId={selectedTemplate.id}
          onTemplateChange={handleTemplateChange}
          customProps={customProps}
          onCustomPropsChange={setCustomProps}
        />
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Component Preview
              </CardTitle>
            </div>
          </CardHeader>
          <ComponentPreview htmlContent={renderedComponent} />
        </Card>
      </div>
    </div>
  )
}
