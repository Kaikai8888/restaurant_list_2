const db = require('../../config/mongoose.js')
const bcrypt = require('bcryptjs')
const Restaurant = require('../restaurant.js')
const Category = require('../category.js')
const User = require('../user.js')
const restaurantSeeds = require('../data/restaurant.json')
const userSeeds = require('../data/users.json')
let categorySeeds = restaurantSeeds.results.map(restaurant => restaurant.category)
categorySeeds = new Set(categorySeeds)
categorySeeds = [...categorySeeds].map(category => { return { name: category } })


db.once('open', () => {
  Promise.all([
    Category.insertMany(categorySeeds),
    Promise.all(userSeeds.results.map(user =>
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => {
          user.password = hash
          return User.create(user)
        })
    ))
  ])
    .then(results => {
      const [categories, users] = results
      restaurantSeeds.results.forEach(restaurant => {
        restaurant.category = categories.find(category => category.name === restaurant.category)._id
        restaurant.userId = users.find(user => user.email === restaurant.userId)._id
        delete restaurant.id
      })
      return Restaurant.insertMany(restaurantSeeds.results)
    })
    .then(() => {
      console.log('Complete seed data creation.')
      process.exit()
    })
    .catch(error => console.error(error))
})
