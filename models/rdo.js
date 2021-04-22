/* eslint-disable camelcase */
const moongose = require('mongoose')

const { Schema } = moongose
const rdoSchema = new Schema({
  rdos: {
    type: Object,
    required: true
  },
  import: {
    type: String,
    required: true
  },
  regionOfInterest: {
    type: Object,
    ref: 'Region',
    required: true
  },
  expirationDate: {
    type: Date,
    default: null,
    required: true
  },
  user: {
    type: Object,
    ref: 'user'
  },
  contractor: {
    type: String,
    required: true
  },
  cmeFile: {
    type: Object
  },
  images: {
    type: Array
  },
  peculiarity: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  needInspection: {
    type: Boolean,
    default: false
  },
  reference: {
    type: String,
    required: true
  },
  requiredDocuments: {
    type: String
  },
  technicalFiles: {
    type: Array
  },
  description: {
    type: String,
    required: true
  }
},
{ timestamps: true })
module.exports = moongose.model('rdos', rdoSchema)
