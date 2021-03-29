const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    const error = new Error('Non autorizzato. Riprova il login!')
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.env.accessTokenSecret)
  } catch (err) {
    err.statusCode = 500
    throw err
  }
  if (!decodedToken) {
    const error = new Error('Non autorizzato. Riprova il login!')
    error.statusCode = 401
    throw error
  }
  req.userId = decodedToken.userId
  next()
}
