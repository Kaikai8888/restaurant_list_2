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
    .sort({ name: 'asc' })
    .populate('numRestaurants')
    .lean()
    .then(categories => {
      categories.sort(sortByNumRestaurants)
      res.render('new', { properties, formAttributes, categories })
    })
    .catch(error => console.error(error))
})

router.post('/', (req, res) => {
  const input = req.body
  Category.find({ name: input.category })
    .lean()
    .then(category => {
      if (category.length === 0) {
        Category.create({ name: input.category })
          .then(category => createNewRestaurant(res, input, category))
          .catch(error => res.send(getFormErrorMessage(error)))
      } else {
        createNewRestaurant(res, input, category[0])
      }
    })
    .catch(error => console.error(error))
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
    .populate('numRestaurants')
    .sort({ name: 'asc' })
    .lean()
    .then(categories => {
      Restaurant.findById(id)
        .populate('category')
        .lean()
        .then(restaurant => {
          categories.sort(sortByNumRestaurants)
          res.render('edit', { restaurant, properties, formAttributes, categories })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const input = req.body
  Category.find({ name: input.category })
    .sort({ name: 'asc' })
    .lean()
    .then(category => {
      if (category.length === 0) {
        Category.create({ name: input.category })
          .then(category => editRestaurant(res, input, category, id))
          .catch(error => res.send(getFormErrorMessage(error)))
      } else {
        editRestaurant(res, input, category[0], id)
      }
    })
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

//function
function createNewRestaurant(res, input, category) {
  input.category = category._id
  Restaurant.create(input)
    .then(res.redirect('/'))
    .catch(error => res.send(getFormErrorMessage(error)))
}

function editRestaurant(res, input, category, id) {
  Restaurant.findById(id)
    .then(restaurant => {
      input.category = category._id
      Object.assign(restaurant, input)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => {
      console.log(error)
      res.send(getFormErrorMessage(error))
    })
}

function sortByNumRestaurants(a, b) {
  return b.numRestaurants - a.numRestaurants
}