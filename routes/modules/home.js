const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')

//show all restaurants
router.get('/', (req, res) => {
  const [sortCondition, sortConditionString] = generateSortCondition(req.query)
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
    .lean()
    .then(restaurants => {
      const searchResults = restaurants
      res.render('index', { restaurants: searchResults, isIndex: true, keyword })
    })
    .catch(error => console.error)
})


module.exports = router


function generateSortCondition(query) {
  const { sortProperty, sortOrder } = query
  let sortCondition = {}
  let sortConditionString = ''

  switch (sortProperty) {
    case 'name':
      sortCondition[sortProperty] = sortOrder
      sortConditionString = sortOrder === 'asc' ? '排序: 店名 A - Z' : '排序: 店名 Z - A'
      break
    case 'category':
      sortCondition[sortProperty] = 'asc'
      sortConditionString = '排序: 類別'
      break
  }

  return [sortCondition, sortConditionString]
}