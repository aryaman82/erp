"use client"

import type { ComponentTemplate } from "@/hooks/use-visual-editor"

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
    {
    id: 'stat-card',
    name: 'Stat Card',
    type: 'card',
    template: `<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">{{title}}</CardTitle>
    <Package className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{{value}}</div>
    <p className="text-xs text-muted-foreground">{{description}}</p>
  </CardContent>
</Card>`,
    props: {
      title: 'Total Items',
      value: '1,234',
      description: '+20.1% from last month',
      icon: 'Package'
    }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    type: 'table',
    template: `<Table>
  <TableHeader>
    <TableRow>
      {{#headers}}
      <TableHead>{{.}}</TableHead>
      {{/headers}}
    </TableRow>
  </TableHeader>
  <TableBody>
    {{#rows}}
    <TableRow>
      {{#cells}}
      <TableCell>{{.}}</TableCell>
      {{/cells}}
    </TableRow>
    {{/rows}}
  </TableBody>
</Table>`,
    props: {
      headers: ['Name', 'Status', 'Quantity'],
      rows: [
        { cells: ['Item 1', 'Active', '100'] },
        { cells: ['Item 2', 'Inactive', '50'] }
      ]
    }
  },
  {
    id: 'custom-form',
    name: 'Form',
    type: 'form',
    template: `<Card>
  <CardHeader>
    <CardTitle>{{title}}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {{#fields}}
    <div className="space-y-2">
      <Label>{{label}}</Label>
      <Input type="{{type}}" placeholder="{{placeholder}}" />
    </div>
    {{/fields}}
    <Button className="w-full">{{submitText}}</Button>
  </CardContent>
</Card>`,
    props: {
      title: 'Add New Item',
      submitText: 'Create Item',
      fields: [
        { label: 'Name', type: 'text', placeholder: 'Enter name...' },
        { label: 'Description', type: 'text', placeholder: 'Enter description...' }
      ]
    }
  }
]
