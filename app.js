const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./restaurant.json')
const restaurantsObject = restaurants.results.reduce((acc, cur) => {
  acc[cur.id] = cur
  return acc
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
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
