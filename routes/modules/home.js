const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')
require('../../models/category.js')
const sortConditionMapping = require('../../models/data/sortConditionMapping.json')
const getCategoryName = require('../../models/functions/getCategoryName.js')

router.get('/', (req, res) => {
  const { keyword, sort } = req.query
  const regExp = keyword ? new RegExp(`${keyword.trim().toLowerCase()}`) : new RegExp('')
  const sortCondition = generateSortCondition(sort)

  Restaurant.find()
    .populate('category', 'name-_id')
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      const searchResults = keyword ? getCategoryName(...restaurants).filter(restaurant =>
        ['name', 'name_en', 'category'].some(key => restaurant[key].includes(keyword))) : getCategoryName(...restaurants)

      res.render('index', { restaurants: searchResults, isIndex: true, keyword, sort, sortConditionMapping })
    })
    .catch(error => console.error(error))
})

module.exports = router




function generateSortCondition(sort) {
  if (!sort || sort === 'none') return
  const [sortProperty, sortOrder] = sort.split('_')
  let sortCondition = {}
  sortCondition[sortProperty] = sortOrder
  return sortCondition
}

