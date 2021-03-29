const route = require('express').Router()
const geoController = require('../controllers/geo')

route.get('/countries', geoController.country)
route.get('/regions', geoController.region)
route.get('/provinces', geoController.province)
route.get('/cities', geoController.city)

module.exports = route
