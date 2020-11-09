const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')
const Category = require('../../models/category.js')
const User = require('../../models/user.js')
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
  input.userId = req.user._id
  Category.findOne({ name: input.category })
    .lean()
    .then(category => {
      if (!category) {
        Category.create({ name: input.category })
          .then(category => createNewRestaurant(res, input, category))
      } else {
        createNewRestaurant(res, input, category)
      }
    })
    .catch(error => {
      console.log(error)
      res.send(getFormErrorMessage(error))
    })
})

//detail page
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Restaurant.findOne({ _id, userId })
    .populate('category', 'name-_id')
    .lean()
    .then(restaurant => res.render('show', { restaurant: getCategoryName(restaurant)[0] }))
    .catch(error => console.error(error))
})

//edit restaurant data
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Category.find()
    .populate('numRestaurants')
    .sort({ name: 'asc' })
    .lean()
    .then(categories => {
      Restaurant.findOne({ _id, userId })
        .populate('category')
        .lean()
        .then(restaurant => {
          categories.sort(sortByNumRestaurants)
          return res.render('edit', { restaurant, properties, formAttributes, categories })
        })
    })
    .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const input = req.body
  const _id = req.params.id
  const userId = req.user._id
  Category.findOne({ name: input.category })
    .sort({ name: 'asc' })
    .lean()
    .then(category => {
      if (!category) {
        Category.create({ name: input.category })
          .then(category => editRestaurant(res, input, category, _id, userId))
      } else {
        editRestaurant(res, input, category, _id, userId)
      }
    })
    .catch(error => {
      console.log(error)
      res.send(getFormErrorMessage(error))
    })
})



//delete
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router

//function
function createNewRestaurant(res, input, category) {
  input.category = category._id
  Restaurant.create(input)
    .then(() => res.redirect('/'))
}

function editRestaurant(res, input, category, _id, userId) {
  Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      input.category = category._id
      Object.assign(restaurant, input)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
}

function sortByNumRestaurants(a, b) {
  return b.numRestaurants - a.numRestaurants
}