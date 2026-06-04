const express = require('express')
const router = express.Router()

const supabase = require('../config/supabase')



router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products(name,reorder_threshold)
    `)

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})



router.get('/low-stock', async (req, res) => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products(name,reorder_threshold)
    `)

  if (error) {
    return res.status(500).json(error)
  }

  const lowStock = data.filter(
    item =>
      item.quantity <=
      item.products.reorder_threshold
  )

  res.json(lowStock)
})



router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('inventory')
    .update(req.body)
    .eq('id', req.params.id)
    .select()

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

module.exports = router