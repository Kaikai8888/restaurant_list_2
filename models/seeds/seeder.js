const db = require('../../config/mongoose.js')
const Restaurant = require('../restaurant.js')
const Category = require('../category.js')
const restaurantSeeds = require('../data/restaurant.json')
let categorySeeds = restaurantSeeds.results.map(restaurant => restaurant.category)
categorySeeds = new Set(categorySeeds)
categorySeeds = [...categorySeeds].map(category => { return { name: category } })

db.once('open', () => {
  Category.insertMany(categorySeeds)
    .then(categories => {
      restaurantSeeds.results.forEach(restaurant => {
        restaurant.category = categories.find(category => category.name === restaurant.category)._id
        delete restaurant.id
      })
      Restaurant.insertMany(restaurantSeeds.results)
        .then(console.log('Complete restaurant seed data creation.'))
        .catch(error => console.error(error))
    })
    .then(console.log('Complete category seed data creation.'))
    .catch(error => console.error(error))
})
