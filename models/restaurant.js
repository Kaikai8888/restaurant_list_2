const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String, required: true, maxlength: 50,
    match: [/.*[^\s]+.*/, 'Please input at least one non-space character.']
  },
  name_en: { type: String, required: false },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  image: {
    type: String, required: true,
    match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, 'Invalid image url']
  },
  location: {
    type: String, required: true,
    match: [/.*[^\s]+.*/, 'Please input at least one non-space character.']
  },
  phone: {
    type: String, required: true,
    match: [/(0\d\s\d{3,4}\s\d{4})|(09\d\d\s\d{3}\s\d{3})/, 'Invalid phone number format, valid format: 0X XXXX XXXX or 09XX XXX XXX']
  },
  google_map: {
    type: String, required: true,
    match: [/https?:\/\/goo\.gl\/maps\/[a-zA-Z0-9]+/, 'Invalid google map url']
  },
  rating: {
    type: Number,
    required: true,
    "min": 0,
    "max": 5,
    validate: {
      validator: (value) => value * 10 % 1 === 0,
      message: (property) => 'Rating can only be represented with one decimal place',
    }
  },
  description: { type: String, required: false, maxlength: 500 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})


module.exports = mongoose.model('Restaurant', restaurantSchema)