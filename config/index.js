const dotenv = require('dotenv')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (!envFound) {
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️')
}

exports.env = {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.MONGODB_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  sendGridKey: process.env.SEND_GRID_KEY,
  api: {
    prefix: '/rest/api/subapp'
  },
  AWS_ID: process.env.AWS_ID,
  AWS_SECRET: process.env.AWS_SECRET,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME
}
