// Mock data for development - simulates a database
export const mockMaterials = [
  {
    material_id: 1,
    name: "Polymer Pellets - Type A",
    type: "raw_material",
    description: "High-quality polymer pellets for injection molding",
    unit: "kg",
    current_stock: 3000.0,
    reorder_level: 500.0,
    cost_per_unit: 2.50,
    supplier: "Polymer Supplies Inc",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    material_id: 2,
    name: "Polymer Pellets - Type B",
    type: "raw_material",
    description: "Premium polymer pellets with enhanced durability",
    unit: "kg",
    current_stock: 2500.0,
    reorder_level: 400.0,
    cost_per_unit: 3.00,
    supplier: "Advanced Materials Co",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    material_id: 3,
    name: "Blue Sheet Material",
    type: "sheet",
    description: "0.5mm thickness blue sheet for manufacturing",
    unit: "rolls",
    current_stock: 80.0,
    reorder_level: 15.0,
    cost_per_unit: 45.00,
    supplier: "Sheet Materials Ltd",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-14T14:20:00Z"
  }
]

export const mockBatches = [
  {
    batch_id: 1,
    batch_number: "SHEET-2023-07-A",
    material_id: 3,
    material_name: "Blue Sheet Material",
    quantity: 100.0,
    unit: "rolls",
    production_date: "2023-07-01",
    status: "active",
    notes: "First batch of blue sheets",
    created_at: "2023-07-01T00:00:00Z"
  }
]

export const mockTransactions = [
  {
    transaction_id: 1,
    type: "in",
    reference: "PO-001",
    notes: "Weekly stock replenishment",
    transaction_time: "2024-01-15T10:30:00Z"
  },
  {
    transaction_id: 2,
    type: "out", 
    reference: "SO-002",
    notes: "Production order #1234",
    transaction_time: "2024-01-14T15:45:00Z"
  }
]

export const mockCustomers = [
  {
    customer_id: 1,
    name: "ABC Manufacturing",
    contact_person: "John Smith",
    email: "john@abcmfg.com",
    phone: "555-0123",
    address: "123 Industrial Blvd, City, State 12345",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    customer_id: 2,
    name: "XYZ Corporation",
    contact_person: "Sarah Johnson",
    email: "sarah@xyzcorp.com",
    phone: "555-0456",
    address: "456 Business Ave, City, State 67890",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export const mockDesigns = [
  {
    design_id: 1,
    name: "Coffee Shop Brand",
    base_cup_material: "12oz Clear Cups",
    description: "Premium coffee shop branding with logo and contact information",
    target_weight_g: 11.8,
    created_at: "2023-06-15T10:00:00Z",
    status: "active",
    print_labels: [
      {
        label_id: 1,
        design_name: "Coffee Shop Brand",
        version: "v1.2",
        print_date: "2023-07-15",
        notes: "Updated contact information",
        status: "active"
      }
    ]
  }
]

export const mockProduction = [
  {
    production_id: 1,
    run_id: 1,
    reference: "PROD-SHEET-01",
    input_material: "Polymer Pellets - Type A",
    output_material: "Blue Sheet - 0.5mm",
    input_quantity: 2000,
    output_quantity: 1900,
    expected_output: 1900,
    efficiency: 95,
    status: "completed",
    start_time: "2024-01-14T08:00:00Z",
    end_time: "2024-01-14T16:00:00Z",
    operator: "John Smith",
    created_at: "2024-01-14T08:00:00Z",
    updated_at: "2024-01-14T16:00:00Z"
  }
]
