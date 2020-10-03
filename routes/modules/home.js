const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

//show all restaurants
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants, isIndex: true })
    })
    .catch(error => console.error(error))
})

//search function
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const regExp = new RegExp(`${keyword}`)
  Restaurant.find({ $or: [{ name: regExp }, { name_en: regExp }, { category: regExp }] })
    .lean()
    .then(restaurants => {
      const searchResults = restaurants
      res.render('index', { restaurants: searchResults, isIndex: true, keyword })
    })
    .catch(error => console.error)
})


module.exports = router
