//require related packages and modules
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')
//server related variables
const app = express()
const port = 3000
//other variables
const formAttributes = require('./models/data/restaurantFormAttributes.json')

//database setting
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => console.log('MongoDB connect!'))

//web server setting
//setting template engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    getByKey: (object, key) => object[key],
    eq: (a, b) => a === b
  }
}))
app.set('view engine', 'handlebars')
//setting static files
app.use(express.static('public'))

//setting routes
//home page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants, isIndex: true })
    })
    .catch(error => console.error(error))
})

//add new restaurant
app.get('/restaurants/new', (req, res) => {
  const properties = Restaurant.schema.paths
  delete properties._id
  delete properties.__v
  res.render('new', { properties, formAttributes })
})
app.post('/restaurants/new', (req, res) => {
  const input = req.body
  console.log(req.body)
})

//detail page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

//search function
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const searchResults = restaurants.filter(item =>
        ['name', 'name_en', 'category'].find(key =>
          item[key].toLowerCase().includes(keyword)
        ))
      res.render('index', { restaurants: searchResults, isIndex: true, keyword })
    })
})


//run web server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

