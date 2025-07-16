import { NextRequest, NextResponse } from 'next/server'
import type { DatabaseSchema, TableSchema, SchemaMigration, SchemaField } from '@/types/system'

// Mock database schema storage (in production, this would connect to a real database)
let currentSchema: DatabaseSchema = {
  id: 'default',
  name: 'Almed ERP Schema',
  version: '1.0.0',
  tables: [
    {
      id: 'materials',
      name: 'materials',
      label: 'Materials',
      description: 'Raw materials and components inventory',
      fields: [
        {
          name: 'id',
          label: 'ID',
          type: { type: 'string', required: true, unique: true },
          order: 0,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: false
        },
        {
          name: 'name',
          label: 'Name',
          type: { type: 'string', required: true },
          order: 1,
          displayInList: true,
          searchable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'description',
          label: 'Description',
          type: { type: 'text', required: false },
          order: 2,
          displayInList: false,
          searchable: true,
          sortable: false,
          editable: true
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: { type: 'number', required: true, validation: { min: 0 } },
          order: 3,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'unit',
          label: 'Unit',
          type: { type: 'string', required: true, validation: { enum: ['kg', 'lbs', 'pieces', 'liters'] } },
          order: 4,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'cost',
          label: 'Cost per Unit',
          type: { type: 'number', required: true, validation: { min: 0 } },
          order: 5,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'supplier',
          label: 'Supplier',
          type: { type: 'string', required: false },
          order: 6,
          displayInList: true,
          searchable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'createdAt',
          label: 'Created At',
          type: { type: 'datetime', required: true },
          order: 7,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: false
        }
      ],
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      displaySettings: {
        listView: {
          defaultSort: 'createdAt',
          pageSize: 10
        },
        formView: {
          layout: 'single'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'batches',
      name: 'batches',
      label: 'Batches',
      description: 'Production batches tracking',
      fields: [
        {
          name: 'id',
          label: 'ID',
          type: { type: 'string', required: true, unique: true },
          order: 0,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: false
        },
        {
          name: 'batchNumber',
          label: 'Batch Number',
          type: { type: 'string', required: true, unique: true },
          order: 1,
          displayInList: true,
          searchable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'materialId',
          label: 'Material',
          type: { type: 'reference', required: true, reference: { table: 'materials', field: 'id' } },
          order: 2,
          displayInList: true,
          searchable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: { type: 'number', required: true, validation: { min: 0 } },
          order: 3,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'status',
          label: 'Status',
          type: { type: 'string', required: true, validation: { enum: ['pending', 'in-progress', 'completed', 'cancelled'] } },
          order: 4,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'createdAt',
          label: 'Created At',
          type: { type: 'datetime', required: true },
          order: 5,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: false
        }
      ],
      relationships: [
        {
          type: 'belongsTo',
          table: 'materials',
          foreignKey: 'materialId',
          localKey: 'id'
        }
      ],
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      displaySettings: {
        listView: {
          defaultSort: 'createdAt',
          pageSize: 10
        },
        formView: {
          layout: 'single'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'transactions',
      name: 'transactions',
      label: 'Transactions',
      description: 'Inventory transactions log',
      fields: [
        {
          name: 'id',
          label: 'ID',
          type: { type: 'string', required: true, unique: true },
          order: 0,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: false
        },
        {
          name: 'type',
          label: 'Type',
          type: { type: 'string', required: true, validation: { enum: ['in', 'out', 'transfer', 'adjustment'] } },
          order: 1,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'materialId',
          label: 'Material',
          type: { type: 'reference', required: true, reference: { table: 'materials', field: 'id' } },
          order: 2,
          displayInList: true,
          searchable: true,
          sortable: true,
          editable: true
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: { type: 'number', required: true },
          order: 3,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: true
        },
        {
          name: 'description',
          label: 'Description',
          type: { type: 'text', required: false },
          order: 4,
          displayInList: false,
          searchable: true,
          sortable: false,
          editable: true
        },
        {
          name: 'createdAt',
          label: 'Created At',
          type: { type: 'datetime', required: true },
          order: 5,
          displayInList: true,
          searchable: false,
          sortable: true,
          editable: false
        }
      ],
      relationships: [
        {
          type: 'belongsTo',
          table: 'materials',
          foreignKey: 'materialId',
          localKey: 'id'
        }
      ],
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      displaySettings: {
        listView: {
          defaultSort: 'createdAt',
          pageSize: 15
        },
        formView: {
          layout: 'single'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  migrations: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      schema: currentSchema
    })
  } catch (error) {
    console.error('Error fetching schema:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schema' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'create_table':
        return await createTable(data)
      case 'modify_table':
        return await modifyTable(data)
      case 'delete_table':
        return await deleteTable(data)
      case 'add_field':
        return await addField(data)
      case 'modify_field':
        return await modifyField(data)
      case 'delete_field':
        return await deleteField(data)
      case 'apply_migration':
        return await applyMigration(data)
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error handling schema request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process schema request' },
      { status: 500 }
    )
  }
}

async function createTable(tableData: Partial<TableSchema>): Promise<NextResponse> {
  if (!tableData.name || !tableData.label) {
    return NextResponse.json(
      { success: false, error: 'Table name and label are required' },
      { status: 400 }
    )
  }

  const newTable: TableSchema = {
    id: tableData.name.toLowerCase().replace(/\s+/g, '_'),
    name: tableData.name.toLowerCase().replace(/\s+/g, '_'),
    label: tableData.label,
    description: tableData.description || '',
    fields: tableData.fields || [
      {
        name: 'id',
        label: 'ID',
        type: { type: 'string', required: true, unique: true },
        order: 0,
        displayInList: true,
        searchable: false,
        sortable: true,
        editable: false
      },
      {
        name: 'createdAt',
        label: 'Created At',
        type: { type: 'datetime', required: true },
        order: 999,
        displayInList: true,
        searchable: false,
        sortable: true,
        editable: false
      }
    ],
    relationships: tableData.relationships || [],
    permissions: tableData.permissions || {
      create: true,
      read: true,
      update: true,
      delete: true
    },
    displaySettings: tableData.displaySettings || {
      listView: {
        defaultSort: 'createdAt',
        pageSize: 10
      },
      formView: {
        layout: 'single'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  currentSchema.tables.push(newTable)
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    table: newTable,
    schema: currentSchema
  })
}

async function modifyTable(tableData: { id: string; updates: Partial<TableSchema> }): Promise<NextResponse> {
  const tableIndex = currentSchema.tables.findIndex(table => table.id === tableData.id)
  if (tableIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Table not found' },
      { status: 404 }
    )
  }

  currentSchema.tables[tableIndex] = {
    ...currentSchema.tables[tableIndex],
    ...tableData.updates,
    updatedAt: new Date().toISOString()
  }
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    table: currentSchema.tables[tableIndex],
    schema: currentSchema
  })
}

async function deleteTable(tableData: { id: string }): Promise<NextResponse> {
  const tableIndex = currentSchema.tables.findIndex(table => table.id === tableData.id)
  if (tableIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Table not found' },
      { status: 404 }
    )
  }

  currentSchema.tables.splice(tableIndex, 1)
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    schema: currentSchema
  })
}

async function addField(data: { tableId: string; field: SchemaField }): Promise<NextResponse> {
  const table = currentSchema.tables.find(table => table.id === data.tableId)
  if (!table) {
    return NextResponse.json(
      { success: false, error: 'Table not found' },
      { status: 404 }
    )
  }

  table.fields.push(data.field)
  table.updatedAt = new Date().toISOString()
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    table,
    schema: currentSchema
  })
}

async function modifyField(data: { tableId: string; fieldName: string; updates: Partial<SchemaField> }): Promise<NextResponse> {
  const table = currentSchema.tables.find(table => table.id === data.tableId)
  if (!table) {
    return NextResponse.json(
      { success: false, error: 'Table not found' },
      { status: 404 }
    )
  }

  const fieldIndex = table.fields.findIndex(field => field.name === data.fieldName)
  if (fieldIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Field not found' },
      { status: 404 }
    )
  }

  table.fields[fieldIndex] = {
    ...table.fields[fieldIndex],
    ...data.updates
  }
  table.updatedAt = new Date().toISOString()
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    table,
    schema: currentSchema
  })
}

async function deleteField(data: { tableId: string; fieldName: string }): Promise<NextResponse> {
  const table = currentSchema.tables.find(table => table.id === data.tableId)
  if (!table) {
    return NextResponse.json(
      { success: false, error: 'Table not found' },
      { status: 404 }
    )
  }

  const fieldIndex = table.fields.findIndex(field => field.name === data.fieldName)
  if (fieldIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Field not found' },
      { status: 404 }
    )
  }

  table.fields.splice(fieldIndex, 1)
  table.updatedAt = new Date().toISOString()
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    table,
    schema: currentSchema
  })
}

async function applyMigration(migration: SchemaMigration): Promise<NextResponse> {
  // In a real implementation, this would execute the actual database migration
  // For now, we'll just track the migration
  migration.appliedAt = new Date().toISOString()
  migration.status = 'applied'
  
  currentSchema.migrations.push(migration)
  currentSchema.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    migration,
    schema: currentSchema
  })
}
