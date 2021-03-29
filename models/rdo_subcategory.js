/* eslint-disable camelcase */
const moongose = require('mongoose')

const { Schema } = moongose
const rdo_subcategorySchema = new Schema({
  code: {
    type: Number
  },
  description: {
    type: String
  },
  macrocategory: {
    type: Schema.Types.ObjectId,
    ref: 'Rdo_macrocategory'
  },
  descMacro: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Rdo_category'
  },
  descCategory: {
    type: String
  }

})
module.exports = moongose.model('rdo_subcategories', rdo_subcategorySchema)
