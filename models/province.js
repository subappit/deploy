const moongose = require('mongoose')

const { Schema } = moongose
const provinceSchema = new Schema({
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
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region'
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  descRegion: {
    type: String
  },
  descCountry: {
    type: String
  }
})
module.exports = moongose.model('Province', provinceSchema)
