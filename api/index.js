const app = require('express').Router()
const authRoute = require('./routes/auth')
const geoRoute = require('./routes/geo')
const userRoute = require('./routes/user')
const optionRoute = require('./routes/option')
const emailRoute = require('./routes/email')
const boardRoute = require('./routes/board')

module.exports = () => {
  app.use('/auth', authRoute)
  app.use('/geo', geoRoute)
  app.use('/user', userRoute)
  app.use('/option', optionRoute)
  app.use('/email', emailRoute)
  app.use('/board', boardRoute)

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    next(err)
  })
  return app
}
