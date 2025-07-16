export interface ModuleConfig {
  id: string
  name: string
  path: string
  icon: string
  description: string
  enabled: boolean
  order: number
  permissions?: string[]
  component?: string
  settings?: Record<string, any>
}

export interface ComponentConfig {
  id: string
  name: string
  type: 'page' | 'component' | 'widget'
  props?: Record<string, any>
  styles?: Record<string, any>
  children?: ComponentConfig[]
}

export interface ThemeConfig {
  id: string
  name: string
  description?: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    border: string
    input: string
    ring: string
    destructive: string
    destructiveForeground: string
    success?: string
    warning?: string
    info?: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
    }
    fontWeight: {
      light: number
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  darkMode: boolean
  custom?: Record<string, any>
}

export interface SystemConfig {
  modules: ModuleConfig[]
  theme: {
    current: string
    themes: ThemeConfig[]
    customThemes: ThemeConfig[]
  }
  layout: {
    sidebarCollapsed: boolean
    headerHeight: number
  }
  features: {
    dynamicModules: boolean
    visualEditor: boolean
    adminPanel: boolean
    customThemes: boolean
  }
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
}

export const DEFAULT_PERMISSIONS = [
  'view_dashboard',
  'view_materials',
  'view_batches',
  'view_transactions',
  'view_production',
  'view_designs',
  'view_reports',
  'edit_materials',
  'edit_batches',
  'edit_transactions',
  'add_materials',
  'delete_materials',
  'admin_panel',
  'module_management',
  'visual_editor'
] as const

export type Permission = typeof DEFAULT_PERMISSIONS[number]

// Schema Management Types
export interface FieldType {
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'text' | 'json' | 'reference'
  required?: boolean
  unique?: boolean
  defaultValue?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: string[]
  }
  reference?: {
    table: string
    field: string
  }
}

export interface SchemaField {
  name: string
  label: string
  type: FieldType
  description?: string
  order: number
  displayInList?: boolean
  searchable?: boolean
  sortable?: boolean
  editable?: boolean
}

export interface TableSchema {
  id: string
  name: string
  label: string
  description?: string
  fields: SchemaField[]
  relationships?: {
    type: 'hasMany' | 'belongsTo' | 'hasOne' | 'manyToMany'
    table: string
    foreignKey?: string
    localKey?: string
  }[]
  permissions?: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
  displaySettings?: {
    listView: {
      defaultSort?: string
      defaultFilter?: Record<string, any>
      pageSize?: number
    }
    formView: {
      layout: 'single' | 'tabs' | 'accordion'
      sections?: {
        title: string
        fields: string[]
      }[]
    }
  }
  hooks?: {
    beforeCreate?: string
    afterCreate?: string
    beforeUpdate?: string
    afterUpdate?: string
    beforeDelete?: string
    afterDelete?: string
  }
  createdAt: string
  updatedAt: string
}

export interface DatabaseSchema {
  id: string
  name: string
  version: string
  tables: TableSchema[]
  migrations: SchemaMigration[]
  createdAt: string
  updatedAt: string
}

export interface SchemaMigration {
  id: string
  version: string
  description: string
  type: 'create_table' | 'modify_table' | 'drop_table' | 'add_field' | 'modify_field' | 'drop_field' | 'add_index' | 'drop_index'
  tableName?: string
  changes: {
    action: 'add' | 'modify' | 'remove'
    field?: SchemaField
    oldField?: SchemaField
    index?: {
      name: string
      fields: string[]
      unique?: boolean
    }
  }[]
  sql?: string
  rollbackSql?: string
  appliedAt?: string
  status: 'pending' | 'applied' | 'failed' | 'rolled_back'
}

export interface ModuleTemplate {
  id: string
  name: string
  description: string
  type: 'crud' | 'dashboard' | 'report' | 'custom'
  icon: string
  fields: {
    name: string
    type: string
    required: boolean
    label: string
  }[]
  views: {
    list: boolean
    detail: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
  customViews?: {
    name: string
    path: string
    component: string
  }[]
}

// Extended SystemConfig to include schema management
export interface ExtendedSystemConfig extends SystemConfig {
  schema: {
    current: DatabaseSchema
    autoGenerateModules: boolean
    autoSyncSchema: boolean
    migrationMode: 'auto' | 'manual' | 'review'
  }
  moduleTemplates: ModuleTemplate[]
}
