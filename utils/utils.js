/* eslint-disable */
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const config = require('../config')

const s3 = new AWS.S3({
  accessKeyId: config.env.AWS_ID,
  secretAccessKey: config.env.AWS_SECRET,
  signatureVersion: 'v4',
  region: 'eu-west-3'
})

const clearFile = async (key) => {
  const params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: key }
  await s3.deleteObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack)
      throw err
    }
  })
}

module.exports = {
    clearFile
}
