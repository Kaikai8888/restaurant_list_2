const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: { type: String, required: true, maxlength: 50 },
  name_en: { type: String, required: false },
  category: { type: String, required: true, maxlength: 20 },
  image: { type: String, required: true },
  location: { type: String, required: true },
  phone: {
    type: String, required: true, match: [/(0\d\s\d{3,4}\s\d{4})|(09\d\d\s\d{3}\s\d{3})/, 'Invalid phone number format, valid format: 0X XXXX XXXX or 09XX XXX XXX']
  },
  google_map: { type: String, required: true },
  rating: {
    type: Number,
    required: true, "min": 0,
    "max": 5, validate: {
      validator: (value) => value * 10 % 1 === 0,
      message: (property) => 'Rating can only be represented with one decimal place',
    }
  },
  description: { type: String, required: false, maxlength: 500 }
})


module.exports = mongoose.model('Restaurant', restaurantSchema)