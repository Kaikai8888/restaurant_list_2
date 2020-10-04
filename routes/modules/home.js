const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant.js')
const sortConditionMapping = require('../../models/data/sortConditionMapping.json')

router.get('/', (req, res) => {
  const { keyword, sort } = req.query
  const regExp = keyword ? new RegExp(`${keyword.trim().toLowerCase()}`) : new RegExp('')
  const sortCondition = generateSortCondition(sort)

  Restaurant.find({ $or: [{ name: regExp }, { name_en: regExp }, { category: regExp }] })
    .sort(sortCondition)
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants, keyword, sort, sortConditionMapping, isIndex: true })
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

