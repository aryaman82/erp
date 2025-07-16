export interface Material {
  material_id: number
  name: string
  type: "raw_material" | "sheet" | "cup" | "printed_cup"
  unit: string
  design_id?: number
  created_at: string
  current_stock?: number
  reorder_level?: number
  cost_per_unit?: number
  supplier?: string
  description?: string
}

export interface Batch {
  batch_id: number
  material_id: number
  batch_number: string
  production_date: string
  created_at: string
  material_name: string
  material_type: string
  quantity: number
  unit: string
  status: "active" | "completed" | "in_progress"
  notes?: string
}

export interface PrintLabel {
  label_id: number
  design_name: string
  version: string
  print_date: string
  notes?: string
  created_at: string
  status: "active" | "archived"
}

export interface CupDesign {
  design_id: number
  name: string
  base_cup_material: string
  description?: string
  target_weight_g?: number
  created_at: string
  status: "active" | "inactive" | "draft"
  print_labels: PrintLabel[]
}

export interface RawMaterialSpec {
  spec_id: number
  material_id: number
  density_g_per_cm3?: number
  melt_index?: number
  color?: string
}

export interface SheetSpec {
  spec_id: number
  material_id: number
  thickness_mm: number
  width_cm: number
  color?: string
  grams_per_sqmeter?: number
}

export interface CupSpec {
  spec_id: number
  material_id: number
  size_oz: number
  diameter_top_mm?: number
  diameter_bottom_mm?: number
  height_mm?: number
  wall_thickness_mm?: number
}

// Specific specification types
export interface RawMaterialSpecification {
  density_g_per_cm3?: number
  melt_index?: number
  color?: string
}

export interface SheetSpecification {
  thickness_mm: number
  width_cm: number
  grams_per_sqmeter?: number
  color?: string
}

export interface CupSpecification {
  size_oz: number
  diameter_top_mm?: number
  diameter_bottom_mm?: number
  height_mm?: number
  wall_thickness_mm?: number
}

export type MaterialSpecification = RawMaterialSpecification | SheetSpecification | CupSpecification

export interface InventoryItem {
  inventory_id: number
  material_id: number
  material_name: string
  material_type: "raw_material" | "sheet" | "cup" | "printed_cup"
  unit: string
  batch_id?: number
  batch_number?: string
  current_quantity: number
  last_updated: string
  production_date?: string
  design_name?: string
  specifications?: MaterialSpecification
}

export interface Transaction {
  transaction_id: number
  type: "in" | "out" | "adjust" | "convert" | "usage"
  material_id: number
  quantity: number
  reference_id?: string
  notes?: string
  transaction_date: string
}

// Add form data types
export interface TransactionFormData {
  type?: "in" | "out" | "adjust" | "convert" | "usage"
  material_id?: number
  quantity?: number
  reference_id?: string
  notes?: string
}

export interface MaterialFormData {
  material_name?: string
  material_type?: "raw_material" | "sheet" | "cup" | "printed_cup"
  unit?: string
  current_quantity?: number
  specifications?: MaterialSpecification
}

export interface TransactionLine {
  line_id: number
  transaction_id: number
  material_id: number
  quantity: number
  direction?: "input" | "output"
  batch_id?: number
  label_id?: number
  input_spec_id?: number
  output_spec_id?: number
}

export interface ProductionRun {
  run_id: number
  reference: string
  input_material: string
  output_material: string
  input_quantity: number
  output_quantity: number
  expected_output: number
  efficiency: number
  status: "planned" | "in_progress" | "completed" | "paused"
  start_time: string
  end_time?: string
  operator: string
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
}

export interface DashboardStats {
  totalMaterials: number;
  totalValue: number;
  lowStockItems: number;
  activeProductionRuns: number;
  materialTypes: {
    raw: number;
    sheets: number;
    cups: number;
    printed_cups: number;
  };
}
