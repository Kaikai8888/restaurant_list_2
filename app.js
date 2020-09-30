//require related packages and modules
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')
//server related variables
const app = express()
const port = 3000

// const restaurants = require('./restaurant.json')
// const restaurantsObject = restaurants.results.reduce((object, restaurant) => {
//   object[restaurant.id] = restaurant
//   return object
// }, {})


//database setting
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => console.log('MongoDB connect!'))

//web server setting
//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//setting static files
app.use(express.static('public'))

//setting routes
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants })
    })
    .catch(error => console.error(error))
})

// app.get('/restaurants/:id', (req, res) => {
//   res.render('show', { restaurant: restaurantsObject[req.params.id] })
// })

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword.trim().toLowerCase()
//   const searchResults = restaurants.results.filter(item => item.name.toLowerCase().includes(keyword))
//   res.render('index', { restaurants: searchResults, keyword })
// })

//run web server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
