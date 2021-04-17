const moongose = require('mongoose')

const { Schema } = moongose
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: Object,
    ref: 'Country',
    required: true
  },
  region: {
    type: Object,
    ref: 'Region',
    required: true
  },
  province: {
    type: Object,
    ref: 'Province',
    required: true
  },
  city: {
    type: Object,
    ref: 'City',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  SDICode: {
    type: String,
    required: true
  },
  vatNumber: {
    type: String,
    required: true
  },
  fiscalCode: {
    type: String,
    required: true
  },
  registeredOfficeAddress: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  webSite: {
    type: String
  },
  pec: {
    type: String,
    required: true
  },
  telephoneNumber: {
    type: String,
    required: true
  },
  rdos: {
    type: Object,
    required: true
  },
  soaFile: {
    type: Object
  },
  isoFile: {
    type: Object
  },
  fgasFile: {
    type: Object
  },
  antimafiaFile: {
    type: Object,
    required: true
  },
  lendingFile: {
    type: Object, // presentazione
    required: true
  },
  certificateFile: {
    type: Object,
    required: true
  },
  durcRegolarityFile: {
    type: Object,
    required: true
  },
  certificateDate: {
    type: Date,
    required: true
  },
  durcRegolarityDate: {
    type: Date,
    required: true
  },
  payed: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  biennial: {
    type: Boolean,
    default: false
  },
  annual: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: Boolean,
    default: false
  },
  subscriptionDate: {
    type: Date,
    default: null
  },
  loadedRdos: {
    type: Array
  }
},
{ timestamps: true })
module.exports = moongose.model('User', userSchema)
