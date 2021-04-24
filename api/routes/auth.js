/* eslint-disable no-unused-vars */
const route = require('express').Router()
const { body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../../models/user')

route.put(
  '/signup',
  [
    body('username')
      .isEmail()
      .withMessage('Inserire una mail valida.')
      .custom((value, { req }) => new Promise((resolve, reject) => {
        User.findOne({ username: value }, (err, username) => {
          if (err) {
            reject(new Error('Server Error'))
          }
          if (username) {
            reject(new Error('E-mail già in uso!'))
          }
          resolve(true)
        })
      })),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ],
  authController.signup
)

route.post('/login',
  [
    body('username')
      .isEmail()
      .withMessage('Inserire una mail valida.')
  ],
  authController.login)

route.get('/forgottenPassword', authController.forgottenPassword)
route.post('/resetPassword', authController.resetPassword)

module.exports = route
