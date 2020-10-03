const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')
//other variables
const formAttributes = require('../../models/data/restaurantFormAttributes.json')
const properties = Restaurant.schema.paths


//add new restaurant
router.get('/new', (req, res) => {
  res.render('new', { properties, formAttributes })
})

router.post('/', (req, res) => {
  const input = req.body
  return Restaurant.create(input)
    .then(res.redirect('/'))
    .catch(error => console.error(error))
})

//detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

//edit restaurant data
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant, properties, formAttributes }))
    .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const input = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, input)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.error(error))
})

//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router