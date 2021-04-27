/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const config = require('../config')

module.exports = async () => {
  try {
    const connection = await mongoose.connect(config.env.databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  } catch (err) {
    console.log('Moongose connection failed, error: ', err)
  }
}
