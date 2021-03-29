/* eslint-disable camelcase */
const moongose = require('mongoose')

const { Schema } = moongose
const rdo_categorySchema = new Schema({
  code: {
    type: Number
  },
  description: {
    type: String
  },
  macrocategory: {
    type: Schema.Types.ObjectId,
    ref: 'Rdo_macrocategory'
  }

})
module.exports = moongose.model('rdo_categories', rdo_categorySchema)
