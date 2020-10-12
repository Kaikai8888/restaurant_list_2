const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')
const Category = require('../../models/category.js')
//other variables
const formAttributes = require('../../models/data/restaurantFormAttributes.json')
const properties = Restaurant.schema.paths
const getFormErrorMessage = require('../../models/functions/getFormErrorMessage.js')
const getCategoryName = require('../../models/functions/getCategoryName.js')

//add new restaurant
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { properties, formAttributes, categories })
    })
    .catch(error => console.error(error))
})

router.post('/', (req, res) => {
  const input = req.body
  if (input.category) {
    delete input['category-name']
    Restaurant.create(input)
      .then(res.redirect('/'))
      .catch(error => res.send(getFormErrorMessage(error)))
  } else {
    Category.create({ name: input['category-name'] })
      .then(category => {
        input.category = category._id
        Restaurant.create(input)
          .then(res.redirect('/'))
          .catch(error => res.send(getFormErrorMessage(error)))
      })
      .catch(error => console.error(error))
  }
})

//detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .populate('category', 'name-_id')
    .lean()
    .then(restaurant => res.render('show', { restaurant: getCategoryName(restaurant)[0] }))
    .catch(error => console.error(error))
})

//edit restaurant data
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Category.find()
    .lean()
    .then(categories => {
      Restaurant.findById(id)
        .populate('category')
        .lean()
        .then(restaurant => res.render('edit', { restaurant, properties, formAttributes, categories }))
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const input = req.body
  delete input['category-name']
  return Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, input)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => {
      console.log(error)
      res.send(getFormErrorMessage(error))
    })

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