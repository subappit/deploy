const express = require('express')
const sgMail = require('@sendgrid/mail')
const path = require('path')
const loaders = require('./loaders')
const config = require('./config')

sgMail.setApiKey(config.env.sendGridKey)

const startServer = async () => {
  const app = express()

  app.use(express.static(path.join(__dirname, '/dist/spa')))

  await loaders.init(app)

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/spa', 'index.html'))
  })

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
