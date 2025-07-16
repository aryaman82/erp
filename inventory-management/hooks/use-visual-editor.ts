"use client"

import { useState, useMemo } from "react"
import Mustache from "mustache"
import { COMPONENT_TEMPLATES } from "@/lib/visual-editor-templates"

export interface ComponentTemplate {
  id: string
  name: string
  type: "card" | "table" | "form" | "chart" | "custom"
  template: string
  props?: Record<string, any>
}

export function useVisualEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<ComponentTemplate>(COMPONENT_TEMPLATES[0])
  const [customProps, setCustomProps] = useState<string>(JSON.stringify(selectedTemplate.props, null, 2))
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

  const handleTemplateChange = (templateId: string) => {
    const template = COMPONENT_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setCustomProps(JSON.stringify(template.props, null, 2))
    }
  }

  const renderedComponent = useMemo(() => {
    try {
      const props = JSON.parse(customProps)
      return Mustache.render(selectedTemplate.template, props)
    } catch (e) {
      return `<div class="text-red-500">Error parsing props: ${(e as Error).message}</div>`
    }
  }, [selectedTemplate, customProps])

  return {
    templates: COMPONENT_TEMPLATES,
    selectedTemplate,
    handleTemplateChange,
    customProps,
    setCustomProps,
    viewMode,
    setViewMode,
    renderedComponent,
    templateCode: selectedTemplate.template,
  }
}
