const express = require('express')
const router = express.Router()
const home = require('./modules/home.js')
const users = require('./modules/users.js')
const auth = require('./modules/auth.js')
const restaurants = require('./modules/restaurants.js')
const { authenticator } = require('../middleware/auths.js')

router.use('/users', users)
router.use('/auth', auth)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

module.exports = router