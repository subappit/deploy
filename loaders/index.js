const expressLoader = require('./express')
const mongooseLoader = require('./mongoose')

exports.init = async (app) => {
  // Connection to DB
  await mongooseLoader()
  console.log('DB connection successful')

  // LOAD EXPRESS APP
  expressLoader(app)
}
