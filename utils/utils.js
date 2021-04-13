/* eslint-disable */
const fs = require('fs')
const path = require('path')
const config = require('../../config')

const clearFile = async (key, s3) => {
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
