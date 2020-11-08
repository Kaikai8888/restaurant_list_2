const express = require('express')
const router = express.Router()
const home = require('./modules/home.js')
const users = require('./modules/users.js')
const restaurants = require('./modules/restaurants.js')

router.use('/users', users)
router.use('/restaurants', restaurants)
router.use('/', home)

module.exports = router