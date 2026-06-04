require('dotenv').config()

const express = require('express')
const cors = require('cors')

const productsRoute = require('./routes/products')
const inventoryRoute = require('./routes/inventory')
const dashboardRoute = require('./routes/dashboard')
const distributorsRoute = require('./routes/distributors')
const ordersRoute = require('./routes/orders')
const customersRoute = require('./routes/customers')
const salesRoutes = require('./routes/sales');


const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management API Running'
  })
})


app.use('/api/products', productsRoute)
app.use('/api/inventory', inventoryRoute)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/distributors', distributorsRoute)
app.use('/api/orders', ordersRoute)
app.use('/api/customers', customersRoute)
app.use('/api/sales', salesRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})