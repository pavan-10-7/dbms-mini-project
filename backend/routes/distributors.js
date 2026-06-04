const express = require('express')
const router = express.Router()

const supabase = require('../config/supabase')

router.get('/', async (req, res) => {

  const { data, error } = await supabase
    .from('distributors')
    .select('*')

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

router.post('/', async (req, res) => {

  const { data, error } = await supabase
    .from('distributors')
    .insert([req.body])
    .select()

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

router.delete('/:id', async (req, res) => {

  const { error } = await supabase
    .from('distributors')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    return res.status(500).json(error)
  }

  res.json({
    success: true
  })
})

module.exports = router