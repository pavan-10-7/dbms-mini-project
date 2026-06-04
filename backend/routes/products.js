const express = require('express')
const router = express.Router()

const supabase = require('../config/supabase')

router.get('/', async (req, res) => {

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      distributors(name)
    `)

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

router.get('/:id', async (req, res) => {

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

router.post('/', async (req, res) => {

  const {
    name,
    category,
    price,
    reorder_threshold,
    distributor_id,
    quantity,
    warehouse_location
  } = req.body

  // Check if same product from same supplier exists
  const { data: existingProduct } = await supabase
    .from('products')
    .select('*')
    .eq('name', name)
    .eq('distributor_id', distributor_id)
    .maybeSingle()

  // CASE 1: Product + Supplier already exists
  if (existingProduct) {

    const { data: inventoryRow } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', existingProduct.id)
      .maybeSingle()

    if (inventoryRow) {

      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          quantity:
            Number(inventoryRow.quantity) +
            Number(quantity || 0)
        })
        .eq('id', inventoryRow.id)

      if (updateError) {
        return res.status(500).json(updateError)
      }

      return res.json({
        success: true,
        action: 'inventory_updated',
        product: existingProduct
      })
    }
  }

  // CASE 2: New supplier for product OR completely new product

  const { data: productData, error: productError } =
    await supabase
      .from('products')
      .insert([
        {
          name,
          category,
          price,
          reorder_threshold,
          distributor_id
        }
      ])
      .select()
      .single()

  if (productError) {
    return res.status(500).json(productError)
  }

  const { error: inventoryError } =
    await supabase
      .from('inventory')
      .insert([
        {
          product_id: productData.id,
          quantity: Number(quantity) || 0,
          warehouse_location:
            warehouse_location || 'Warehouse A'
        }
      ])

  if (inventoryError) {
    return res.status(500).json(inventoryError)
  }

  res.json({
    success: true,
    action: 'product_created',
    product: productData
  })
})

router.put('/:id', async (req, res) => {

  const { data, error } = await supabase
    .from('products')
    .update(req.body)
    .eq('id', req.params.id)
    .select()

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

router.delete('/:id', async (req, res) => {

  // Delete inventory first
  await supabase
    .from('inventory')
    .delete()
    .eq('product_id', req.params.id)

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    return res.status(500).json(error)
  }

  res.json({
    success: true,
    message: 'Product deleted'
  })
})

module.exports = router