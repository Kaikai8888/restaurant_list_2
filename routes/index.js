const express = require('express')
const router = express.Router()
const home = require('./modules/home.js')
const restaurants = require('./modules/restaurants.js')

router.use('/', home)
router.use('/restaurants', restaurants)

module.exports = router