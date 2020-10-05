const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const router = require('./routes')
require('./config/mongoose.js')

const app = express()
const port = 3000

//web server setting
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./utils/hbsHelpers.js')
}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(router)

//run web server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})



