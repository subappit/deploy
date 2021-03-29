const dotenv = require('dotenv')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (!envFound) {
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️')
}

exports.env = {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.MONGODB_URI,
  accessTokenSecret: 'jsdruyifwerkhghasrfiwedariosdbeqwhrfvdanto',
  sendGridKey: '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',
  api: {
    prefix: '/rest/api/subapp'
  }
}
