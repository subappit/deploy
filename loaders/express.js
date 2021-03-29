const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const config = require('../config')
const routes = require('../api')

module.exports = (app) => {
  app.use(helmet())
  app.use(compression())

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'subapp.log'),
    { flags: 'a' }
  )
  app.use(morgan('combined', { stream: accessLogStream }))
  app.use(express.json())

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors())

  app.use('/public', express.static(path.join(path.dirname(require.main.filename), 'public')))

  // Load API routes
  app.use(config.env.api.prefix, routes())

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    next(err)
  })

  /// error handlers
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res
        .status(404)
        .send({ message: err.message })
        .end()
    }
    return next(err)
  })
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500)
    res.json({
      message: err.data && err.data.length > 0 ? err.data[0].msg : err.message,
      data: err.data
    })
  })
}
