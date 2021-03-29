/* eslint-disable camelcase */
const moongose = require('mongoose')

const { Schema } = moongose
const rdo_macrocategorySchema = new Schema({
  code: {
    type: Number
  },
  description: {
    type: String
  }

})
module.exports = moongose.model('rdo_macrocategories', rdo_macrocategorySchema)
