/* eslint-disable */
const fs = require('fs')
const path = require('path')

const clearFile = (filePath) => {
  fs.unlink(path.join(__dirname, '../', filePath), (err) => {
    if (err) {
      err.statusCode = 500
      throw err
    }
  })
}

module.exports = {
    clearFile
}
