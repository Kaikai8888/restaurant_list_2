const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  name: {
    required: true,
    type: String,
    match: [/.*[^\s]+.*/, 'For category field, please input at least one non-space characters.']
  }
})

module.exports = mongoose.model('Category', categorySchema)

