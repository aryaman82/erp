const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3001',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Configure Postgres connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'inventory_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Health check route
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ status: 'healthy', timestamp: result.rows[0].now })
  } catch (error) {
    console.error('Database health check failed:', error)
    res.status(500).json({ status: 'unhealthy', error: error.message })
  }
})

// Sample route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows)
  } catch (error) {
    console.error('Database query failed:', error)
    res.status(500).json({ error: 'Database query failed' })
  }
})

// Transactions API endpoints
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY transaction_time DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

app.post('/api/transactions', async (req, res) => {
  const { type, reference, notes } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO transactions (type, reference, notes, transaction_time) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [type, reference, notes]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create transaction:', error)
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params
  const { type, reference, notes } = req.body
  try {
    const result = await pool.query(
      'UPDATE transactions SET type = $1, reference = $2, notes = $3 WHERE transaction_id = $4 RETURNING *',
      [type, reference, notes, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update transaction:', error)
    res.status(500).json({ error: 'Failed to update transaction' })
  }
})

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM transactions WHERE transaction_id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

// Production runs API endpoints
app.get('/api/production', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM production_runs ORDER BY start_time DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch production runs:', error)
    res.status(500).json({ error: 'Failed to fetch production runs' })
  }
})

app.post('/api/production', async (req, res) => {
  const { reference, input_material, output_material, input_quantity, expected_output, operator, start_time } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO production_runs (reference, input_material, output_material, input_quantity, output_quantity, 
       expected_output, efficiency, status, start_time, operator) 
       VALUES ($1, $2, $3, $4, 0, $5, 0, 'planned', $6, $7) RETURNING *`,
      [reference, input_material, output_material, input_quantity, expected_output, start_time, operator]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create production run:', error)
    res.status(500).json({ error: 'Failed to create production run' })
  }
})

app.put('/api/production/:id', async (req, res) => {
  const { id } = req.params
  const { status, output_quantity, end_time } = req.body
  try {
    const updateFields = []
    const values = []
    let paramCount = 1

    if (status !== undefined) {
      updateFields.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++
    }
    
    if (output_quantity !== undefined) {
      updateFields.push(`output_quantity = $${paramCount}`)
      values.push(output_quantity)
      paramCount++
    }
    
    if (end_time !== undefined) {
      updateFields.push(`end_time = $${paramCount}`)
      values.push(end_time)
      paramCount++
    }

    if (status === 'completed' && output_quantity !== undefined) {
      // Calculate efficiency
      const runResult = await pool.query('SELECT expected_output FROM production_runs WHERE run_id = $1', [id])
      if (runResult.rows.length > 0) {
        const efficiency = Math.round((output_quantity / runResult.rows[0].expected_output) * 100)
        updateFields.push(`efficiency = $${paramCount}`)
        values.push(efficiency)
        paramCount++
      }
    }

    values.push(id)
    const result = await pool.query(
      `UPDATE production_runs SET ${updateFields.join(', ')} WHERE run_id = $${paramCount} RETURNING *`,
      values
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Production run not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update production run:', error)
    res.status(500).json({ error: 'Failed to update production run' })
  }
})

// Designs API endpoints
app.get('/api/designs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cup_designs ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch designs:', error)
    res.status(500).json({ error: 'Failed to fetch designs' })
  }
})

app.post('/api/designs', async (req, res) => {
  const { name, base_cup_material, description, target_weight_g, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO cup_designs (name, base_cup_material, description, target_weight_g, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [name, base_cup_material, description, target_weight_g, status || 'draft']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create design:', error)
    res.status(500).json({ error: 'Failed to create design' })
  }
})

app.put('/api/designs/:id', async (req, res) => {
  const { id } = req.params
  const { name, base_cup_material, description, target_weight_g, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE cup_designs SET name = $1, base_cup_material = $2, description = $3, target_weight_g = $4, status = $5 WHERE design_id = $6 RETURNING *',
      [name, base_cup_material, description, target_weight_g, status, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Design not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update design:', error)
    res.status(500).json({ error: 'Failed to update design' })
  }
})

app.delete('/api/designs/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM cup_designs WHERE design_id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Design not found' })
    }
    res.json({ message: 'Design deleted successfully' })
  } catch (error) {
    console.error('Failed to delete design:', error)
    res.status(500).json({ error: 'Failed to delete design' })
  }
})

// Materials API endpoints
app.get('/api/materials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch materials:', error)
    res.status(500).json({ error: 'Failed to fetch materials' })
  }
})

app.post('/api/materials', async (req, res) => {
  const { name, type, description, unit, current_stock, reorder_level, cost_per_unit, supplier } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO materials (name, type, description, unit, current_stock, reorder_level, cost_per_unit, supplier) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, type, description, unit, current_stock || 0, reorder_level || 0, cost_per_unit || 0, supplier]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create material:', error)
    res.status(500).json({ error: 'Failed to create material' })
  }
})

app.put('/api/materials/:id', async (req, res) => {
  const { id } = req.params
  const { name, type, description, unit, current_stock, reorder_level, cost_per_unit, supplier } = req.body
  try {
    const result = await pool.query(
      'UPDATE materials SET name = $1, type = $2, description = $3, unit = $4, current_stock = $5, reorder_level = $6, cost_per_unit = $7, supplier = $8, updated_at = NOW() WHERE material_id = $9 RETURNING *',
      [name, type, description, unit, current_stock, reorder_level, cost_per_unit, supplier, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update material:', error)
    res.status(500).json({ error: 'Failed to update material' })
  }
})

app.delete('/api/materials/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM materials WHERE material_id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' })
    }
    res.json({ message: 'Material deleted successfully' })
  } catch (error) {
    console.error('Failed to delete material:', error)
    res.status(500).json({ error: 'Failed to delete material' })
  }
})

// Batches API endpoints
app.get('/api/batches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM batches ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch batches:', error)
    res.status(500).json({ error: 'Failed to fetch batches' })
  }
})

app.post('/api/batches', async (req, res) => {
  const { batch_number, material_name, quantity, unit, production_date, status, notes } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO batches (batch_number, material_name, quantity, unit, production_date, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [batch_number, material_name, quantity, unit, production_date, status || 'active', notes]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create batch:', error)
    res.status(500).json({ error: 'Failed to create batch' })
  }
})

app.put('/api/batches/:id', async (req, res) => {
  const { id } = req.params
  const { batch_number, material_name, quantity, unit, production_date, status, notes } = req.body
  try {
    const result = await pool.query(
      'UPDATE batches SET batch_number = $1, material_name = $2, quantity = $3, unit = $4, production_date = $5, status = $6, notes = $7 WHERE batch_id = $8 RETURNING *',
      [batch_number, material_name, quantity, unit, production_date, status, notes, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Batch not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update batch:', error)
    res.status(500).json({ error: 'Failed to update batch' })
  }
})

app.delete('/api/batches/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM batches WHERE batch_id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Batch not found' })
    }
    res.json({ message: 'Batch deleted successfully' })
  } catch (error) {
    console.error('Failed to delete batch:', error)
    res.status(500).json({ error: 'Failed to delete batch' })
  }
})

// Customers API endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
})

app.post('/api/customers', async (req, res) => {
  const { name, email, phone, address, company, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, address, company, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, address, company, status || 'active']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create customer:', error)
    res.status(500).json({ error: 'Failed to create customer' })
  }
})

app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, phone, address, company, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4, company = $5, status = $6, updated_at = NOW() WHERE customer_id = $7 RETURNING *',
      [name, email, phone, address, company, status, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update customer:', error)
    res.status(500).json({ error: 'Failed to update customer' })
  }
})

app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Failed to delete customer:', error)
    res.status(500).json({ error: 'Failed to delete customer' })
  }
})

// System Configuration API endpoints
app.get('/api/system-config', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM system_config')
    const config = {}
    result.rows.forEach(row => {
      config[row.config_key] = row.config_value
    })
    res.json(config)
  } catch (error) {
    console.error('Failed to fetch system config:', error)
    res.status(500).json({ error: 'Failed to fetch system config' })
  }
})

app.put('/api/system-config/:key', async (req, res) => {
  const { key } = req.params
  const { value, description } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO system_config (config_key, config_value, description) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (config_key) 
       DO UPDATE SET config_value = $2, description = COALESCE($3, system_config.description), updated_at = NOW() 
       RETURNING *`,
      [key, JSON.stringify(value), description]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update system config:', error)
    res.status(500).json({ error: 'Failed to update system config' })
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  pool.end(() => {
    console.log('Database pool closed')
    process.exit(0)
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
