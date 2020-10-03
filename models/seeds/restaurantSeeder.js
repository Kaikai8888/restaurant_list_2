const db = require('../../config/mongoose.js')
const restaurantSeeds = require('../data/restaurant.json').results
const Restaurant = require('../restaurant.js')

db.once('open', () => {
  //store seed data into database
  restaurantSeeds.forEach(seed => {
    delete seed.id
    Restaurant.create(seed)
  })
  console.log('Complete creating seed data')
})
