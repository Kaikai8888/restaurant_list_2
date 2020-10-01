//require related packages and modules
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant.js')
//server related variables
const app = express()
const port = 3000
//other variables
const formAttributes = require('./models/data/restaurantFormAttributes.json')
const properties = Restaurant.schema.paths

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
    eq: (a, b) => a === b,
    or: (a, b) => a || b
  }
}))
app.set('view engine', 'handlebars')
//setting static files
app.use(express.static('public'))
//setting body parser
app.use(bodyParser.urlencoded({ extended: true }))

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
  res.render('new', { properties, formAttributes })
})

app.post('/restaurants/new', (req, res) => {
  const input = req.body
  return Restaurant.create(input)
    .then(res.redirect('/'))
    .catch(error => console.error(error))
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

//edit restaurant data
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant, properties, formAttributes }))
    .catch(error => console.error(error))
})



//run web server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

