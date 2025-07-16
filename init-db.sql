-- Database initialization script for Almed ERP
-- Run this script to create the necessary tables

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
    material_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    description TEXT,
    unit VARCHAR(50),
    current_stock DECIMAL(10,2) DEFAULT 0,
    reorder_level DECIMAL(10,2) DEFAULT 0,
    cost_per_unit DECIMAL(10,2) DEFAULT 0,
    supplier VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
    batch_id SERIAL PRIMARY KEY,
    batch_number VARCHAR(100) NOT NULL UNIQUE,
    material_id INTEGER REFERENCES materials(material_id),
    material_name VARCHAR(255),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    production_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    company VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_config table for dynamic schema management
CREATE TABLE IF NOT EXISTS system_config (
    config_id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dynamic_tables for schema management
CREATE TABLE IF NOT EXISTS dynamic_tables (
    table_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    description TEXT,
    fields JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjust', 'convert')),
    reference VARCHAR(100),
    notes TEXT,
    transaction_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create production_runs table
CREATE TABLE IF NOT EXISTS production_runs (
    run_id SERIAL PRIMARY KEY,
    reference VARCHAR(100) NOT NULL,
    input_material VARCHAR(255) NOT NULL,
    output_material VARCHAR(255) NOT NULL,
    input_quantity DECIMAL(10,2) DEFAULT 0,
    output_quantity DECIMAL(10,2) DEFAULT 0,
    expected_output DECIMAL(10,2) DEFAULT 0,
    efficiency INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'paused')),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    operator VARCHAR(100)
);

-- Create cup_designs table
CREATE TABLE IF NOT EXISTS cup_designs (
    design_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_cup_material VARCHAR(255),
    description TEXT,
    target_weight_g DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create print_labels table (for designs)
CREATE TABLE IF NOT EXISTS print_labels (
    label_id SERIAL PRIMARY KEY,
    design_id INTEGER REFERENCES cup_designs(design_id) ON DELETE CASCADE,
    design_name VARCHAR(255),
    version VARCHAR(50),
    print_date DATE,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

-- Insert sample data for materials
INSERT INTO materials (name, type, description, unit, current_stock, reorder_level, cost_per_unit, supplier) VALUES 
('Polymer Pellets - Type A', 'Raw Material', 'High-quality polymer pellets for sheet production', 'kg', 15000, 5000, 2.50, 'ChemSupply Inc'),
('Polymer Pellets - Type B', 'Raw Material', 'Standard polymer pellets for general use', 'kg', 8500, 3000, 2.20, 'PlasticSource Ltd'),
('Blue Sheet - 0.5mm', 'Semi-Finished', 'Blue colored plastic sheet 0.5mm thickness', 'sqm', 2500, 500, 12.50, 'Internal Production'),
('Clear Sheet - 0.4mm', 'Semi-Finished', 'Transparent plastic sheet 0.4mm thickness', 'sqm', 1800, 400, 11.80, 'Internal Production'),
('12oz Clear Cups', 'Finished Product', 'Clear plastic cups 12oz capacity', 'pieces', 45000, 10000, 0.15, 'Internal Production'),
('16oz Clear Cups', 'Finished Product', 'Clear plastic cups 16oz capacity', 'pieces', 32000, 8000, 0.18, 'Internal Production'),
('Branded Coffee Cups', 'Finished Product', 'Printed coffee cups with brand logo', 'pieces', 12500, 2000, 0.22, 'Internal Production')
ON CONFLICT DO NOTHING;

-- Insert sample data for batches
INSERT INTO batches (batch_number, material_name, quantity, unit, production_date, status, notes) VALUES 
('BATCH-2024-001', 'Polymer Pellets - Type A', 5000, 'kg', '2024-01-10', 'active', 'Fresh delivery from ChemSupply Inc'),
('BATCH-2024-002', 'Blue Sheet - 0.5mm', 500, 'sqm', '2024-01-14', 'used', 'Used for cup production run PROD-CUP-01'),
('BATCH-2024-003', 'Clear Sheet - 0.4mm', 300, 'sqm', '2024-01-15', 'active', 'Ready for next production run'),
('BATCH-2024-004', '12oz Clear Cups', 15000, 'pieces', '2024-01-13', 'active', 'Quality control passed'),
('BATCH-2024-005', 'Branded Coffee Cups', 5000, 'pieces', '2024-01-12', 'active', 'Printing completed successfully')
ON CONFLICT DO NOTHING;

-- Insert sample data for customers
INSERT INTO customers (name, email, phone, address, company, status) VALUES 
('Metro Coffee Chain', 'orders@metrocoffee.com', '+1-555-0123', '123 Main St, City, State 12345', 'Metro Coffee Corp', 'active'),
('Downtown Cafe', 'manager@downtowncafe.com', '+1-555-0456', '456 Business Ave, City, State 12346', 'Downtown Hospitality', 'active'),
('University Bookstore', 'purchasing@university.edu', '+1-555-0789', '789 Campus Dr, University City, State 12347', 'State University', 'active'),
('Festival Events Co', 'events@festivalco.com', '+1-555-0321', '321 Event Plaza, City, State 12348', 'Festival Events LLC', 'active'),
('Quick Stop Markets', 'procurement@quickstop.com', '+1-555-0654', '654 Retail Blvd, City, State 12349', 'Quick Stop Inc', 'inactive')
ON CONFLICT DO NOTHING;

-- Insert initial system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES 
('modules', '{"transactions": {"name": "Transactions", "enabled": true}, "production": {"name": "Production", "enabled": true}, "designs": {"name": "Designs", "enabled": true}, "materials": {"name": "Materials", "enabled": true}, "batches": {"name": "Batches", "enabled": true}, "customers": {"name": "Customers", "enabled": true}}', 'System modules configuration'),
('theme', '{"primary": "#3b82f6", "secondary": "#64748b", "accent": "#10b981", "background": "#ffffff", "surface": "#f8fafc"}', 'Application theme colors'),
('company_info', '{"name": "Almed", "tagline": "Advanced Manufacturing Solutions", "contact": "contact@almed.com"}', 'Company information')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW();

-- Insert sample data for transactions
INSERT INTO transactions (type, reference, notes, transaction_time) VALUES 
('in', 'PO-001', 'Initial raw material purchase from supplier', '2024-01-15T08:00:00Z'),
('convert', 'PROD-SHEET-01', 'Sheet production run - converting raw materials to sheets', '2024-01-14T10:30:00Z'),
('convert', 'PROD-CUP-01', 'Cup molding shift A - sheets to cups conversion', '2024-01-13T14:15:00Z'),
('convert', 'PRINT-01', 'Coffee cup printing run', '2024-01-12T09:45:00Z'),
('out', 'SO-001', 'Customer order shipment - 5000 printed cups', '2024-01-11T16:20:00Z'),
('adjust', 'ADJ-001', 'Inventory adjustment after physical count', '2024-01-10T12:00:00Z'),
('in', 'PO-002', 'Emergency raw material delivery', '2024-01-09T15:30:00Z'),
('out', 'WASTE-001', 'Defective products disposal', '2024-01-08T11:15:00Z')
ON CONFLICT DO NOTHING;

-- Insert sample data for production runs
INSERT INTO production_runs (reference, input_material, output_material, input_quantity, output_quantity, expected_output, efficiency, status, start_time, end_time, operator) VALUES 
('PROD-SHEET-01', 'Polymer Pellets - Type A', 'Blue Sheet - 0.5mm', 2000, 1900, 1900, 95, 'completed', '2024-01-14T08:00:00Z', '2024-01-14T16:00:00Z', 'John Smith'),
('PROD-CUP-01', 'Blue Sheet - 0.5mm', '12oz Clear Cups', 20, 17000, 17000, 100, 'completed', '2024-01-13T10:00:00Z', '2024-01-13T18:00:00Z', 'Sarah Johnson'),
('PRINT-01', '12oz Clear Cups', 'Branded Coffee Cups', 5000, 4850, 5000, 97, 'completed', '2024-01-12T09:00:00Z', '2024-01-12T15:00:00Z', 'Mike Wilson'),
('PROD-SHEET-02', 'Polymer Pellets - Type B', 'Clear Sheet - 0.4mm', 1500, 1200, 1395, 86, 'in_progress', '2024-01-15T08:00:00Z', NULL, 'David Brown'),
('PROD-CUP-02', 'Clear Sheet - 0.4mm', '16oz Clear Cups', 0, 0, 15600, 0, 'planned', '2024-01-16T08:00:00Z', NULL, 'Lisa Davis')
ON CONFLICT DO NOTHING;

-- Insert sample data for cup designs
INSERT INTO cup_designs (name, base_cup_material, description, target_weight_g, status, created_at) VALUES 
('Coffee Shop Brand', '12oz Clear Cups', 'Premium coffee shop branding with logo and contact information', 11.8, 'active', '2023-06-15T10:00:00Z'),
('Summer Festival', '16oz Clear Cups', 'Colorful summer festival theme with event details', 14.2, 'active', '2023-05-20T14:30:00Z'),
('Soda Promotion', '16oz Clear Cups', 'Limited time soda brand promotion', 14.5, 'inactive', '2023-07-01T09:15:00Z')
ON CONFLICT DO NOTHING;

-- Insert sample print labels
INSERT INTO print_labels (design_id, design_name, version, print_date, notes, status) VALUES 
(1, 'Coffee Shop Brand', 'v1.2', '2023-07-15', 'Updated logo and color scheme', 'active'),
(1, 'Coffee Shop Brand', 'v1.1', '2023-06-20', 'Initial production version', 'archived'),
(2, 'Summer Festival', 'v2.0', '2023-07-18', 'Final festival design with sponsor logos', 'active'),
(3, 'Soda Promotion', 'v1.0', '2023-07-20', 'Promotional campaign design', 'archived')
ON CONFLICT DO NOTHING;
