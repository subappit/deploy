const express = require('express')
const path = require('path')
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
    path.join(__dirname, 'subapp.log'), { flags: 'a' }
  )
  app.use(morgan('combined', { stream: accessLogStream }))
  // aggiunto limit per aws s3 (da verificare)
  app.use(express.json({ limit: '1gb' }))

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization','X-Amz-Date','X-Api-Key', 'X-Amz-Security-Token')
    next()
  })

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
