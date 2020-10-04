const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

let sortCondition = {}
let sortConditionString = ''

//get sorting conditions
router.use('/', (req, res) => {
  if (!req.query.sortProperty) return
  const { sortProperty, sortOrder } = req.query
  switch (sortProperty) {
    case 'name':
      sortCondition[sortProperty] = sortOrder
      sortConditionString = sortOrder === 'asc' ? '排序: 店名 A - Z' : '排序: 店名 Z - A'
      break
    case 'category':
      sortCondition[sortProperty] = 'asc'
      sortConditionString = '排序: 類別'
      break
    default:
      sortCondition = {}
      sortConditionString = ''
      break
  }
})


//show all restaurants
router.get('/', (req, res) => {
  Restaurant.find()
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants, isIndex: true, sortConditionString })
    })
    .catch(error => console.error(error))
})

//search function
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const regExp = new RegExp(`${keyword}`)
  Restaurant.find({ $or: [{ name: regExp }, { name_en: regExp }, { category: regExp }] })
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      const searchResults = restaurants
      res.render('index', { restaurants: searchResults, isIndex: true, keyword, sortConditionString })
    })
    .catch(error => console.error)
})


module.exports = router