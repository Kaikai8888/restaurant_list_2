//require packages and data
const restaurantSeeds = require('../data/restaurant.json').results
const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')

//data base connection setting
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => {
  console.log('MongoDB connect!')
  //store seed data into database
  restaurantSeeds.forEach(seed => {
    delete seed.id
    Restaurant.create(seed)
  })
  console.log('Complete creating seed data')
})
