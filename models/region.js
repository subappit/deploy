const moongose = require('mongoose')

const { Schema } = moongose
const regionSchema = new Schema({
  code: {
    type: Number,
    unique: true
  },
  description: {
    type: String,
    unique: true
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  }
})
module.exports = moongose.model('Region', regionSchema)
