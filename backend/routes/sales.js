const express = require('express');
const router = express.Router();

const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers(name)
    `)
    .order('id', { ascending: false });

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

router.post('/', async (req, res) => {
  try {

    const {
      customer_id,
      product_id,
      quantity,
      payment_mode
    } = req.body;

    // Product
    const { data: product, error: productError } =
      await supabase
        .from('products')
        .select('*')
        .eq('id', product_id)
        .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Inventory
    const { data: inventory, error: inventoryError } =
      await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', product_id)
        .single();

    if (inventoryError || !inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    // Stock check
    if (inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${inventory.quantity} items available`
      });
    }

    // Reduce inventory
    const { error: updateInventoryError } =
      await supabase
        .from('inventory')
        .update({
          quantity:
            inventory.quantity - quantity
        })
        .eq('id', inventory.id);

    if (updateInventoryError) {
      return res.status(500).json(updateInventoryError);
    }

    // Create order
    const totalAmount =
      Number(product.price) *
      Number(quantity);

    const { data: orderData, error: orderError } =
        await supabase
            .from('orders')
            .insert([
            {
                customer_id,
                order_date: new Date()
                .toISOString()
                .split('T')[0],
                total_amount: totalAmount,
                payment_mode,
                status: 'Delivered'
            }
            ])
            .select()
            .single();

        if (orderError) {
        return res.status(500).json(orderError);
        }

        // Create order item

        const { error: orderItemError } =
        await supabase
            .from('order_items')
            .insert([
            {
                order_id: orderData.id,
                product_id: product.id,
                quantity,
                price: product.price
            }
            ]);

        if (orderItemError) {
        return res.status(500).json(orderItemError);
        }

    if (orderError) {
      return res.status(500).json(orderError);
    }

    res.json({
      success: true,
      message: 'Sale completed',
      order: orderData
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;