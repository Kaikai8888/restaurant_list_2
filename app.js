const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const Restaurant = require('./models/restaurant.js')
const router = require('./routes')
const app = express()
const port = 3000

//database setting
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => console.log('MongoDB connect!'))

//web server setting
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    getByKey: (object, key) => object[key],
    eq: (a, b) => a === b,
    or: (a, b) => a || b
  }
}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(router)

//run web server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})



