const express = require('express')
const router = express.Router()

const supabase = require('../config/supabase')

router.get('/', async (req, res) => {
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { data: inventory } = await supabase
    .from('inventory')
    .select(`
      quantity,
      products(reorder_threshold)
    `)

  const lowStockProducts = inventory.filter(
    item =>
      item.quantity <=
      item.products.reorder_threshold
  ).length

  res.json({
    totalProducts,
    totalCustomers,
    totalOrders,
    lowStockProducts
  })
})

module.exports = router