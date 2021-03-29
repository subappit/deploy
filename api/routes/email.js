/* eslint-disable max-len */
const route = require('express').Router()
const emailController = require('../controllers/email')

route.post('/send', emailController.send)

module.exports = route
