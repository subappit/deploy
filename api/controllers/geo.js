/* eslint-disable no-param-reassign */
const Region = require('../../models/region')
const Country = require('../../models/country')
const Province = require('../../models/province')
const City = require('../../models/city')

exports.country = (req, res, next) => {
  Country.find().sort('description')
    .then((countries) => {
      res.status(200).json({
        countries
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.region = (req, res, next) => {
  const query = req.query && req.query.countryId ? { country: req.query.countryId } : null
  Region.find(query).sort('description')
    .then((regions) => {
      res.status(200).json({
        regions
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.province = (req, res, next) => {
  const query = req.query && req.query.regionId ? { region: req.query.regionId } : null
  Province.find(query).sort('description')
    .then((provinces) => {
      res.status(200).json({
        provinces
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.city = (req, res, next) => {
  const query = req.query && req.query.provinceId ? { province: req.query.provinceId } : null
  City.find(query).sort('description')
    .then((cities) => {
      res.status(200).json({
        cities
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
