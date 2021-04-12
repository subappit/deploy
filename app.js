const express = require('express')
const sgMail = require('@sendgrid/mail')
const loaders = require('./loaders')
const config = require('./config')

sgMail.setApiKey(config.env.sendGridKey)

const startServer = async () => {
  const app = express()

  await loaders.init(app)

  app.listen(config.env.port, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(`app listening on port ${config.env.port}`)
  }).on('error', (err) => {
    console.error(err)
    process.exit(1)
  })
}

startServer()
