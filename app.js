const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./restaurant.json')
const restaurantsObject = restaurants.results.reduce((object, restaurant) => {
  object[restaurant.id] = restaurant
  return object
}, {})

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//setting routes
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurants.results })
})

app.get('/restaurants/:id', (req, res) => {
  res.render('show', { restaurant: restaurantsObject[req.params.id] })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const searchResults = restaurants.results.filter(item => item.name.toLowerCase().includes(keyword))
  res.render('index', { restaurants: searchResults, keyword })
})


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
