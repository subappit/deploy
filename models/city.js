const moongose = require('mongoose')

const { Schema } = moongose
const citySchema = new Schema({
  code: {
    type: Number,
    unique: true
  },
  description: {
    type: String,
    unique: true
  },
  descRegion: {
    type: String
  },
  descProvince: {
    type: String
  },
  descCountry: {
    type: String
  },
  province: {
    type: Schema.Types.ObjectId,
    ref: 'Province'
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region'
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  }
})
module.exports = moongose.model('City', citySchema)
