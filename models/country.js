const moongose = require('mongoose')

const { Schema } = moongose

const countrySchema = new Schema({
  code: {
    type: Number,
    unique: true
  },
  description: {
    type: String,
    unique: true
  },
  acronym: {
    type: String,
    unique: true
  },
  extendedAcronym: {
    type: String,
    unique: true
  }
})
module.exports = moongose.model('Country', countrySchema)
