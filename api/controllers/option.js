/* eslint-disable camelcase,no-param-reassign */
const Rdo_macrocategory = require('../../models/rdo_macrocategory')
const Rdo_category = require('../../models/rdo_category')
const Rdo_subcategory = require('../../models/rdo_subcategory')

exports.rdo_macro = (req, res, next) => {
  Rdo_macrocategory.find().sort('description')
    .then((macroRdo) => {
      res.status(200).json({
        macroRdo
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.rdo_cat = (req, res, next) => {
  const query = req.query && req.query.rdomacroId ? { macrocategory: req.query.rdomacroId } : null
  Rdo_category.find(query).sort('description')
    .then((catRdo) => {
      res.status(200).json({
        catRdo
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.rdo_subcat = (req, res, next) => {
  const query = req.query && req.query.rdocatId ? { category: req.query.rdocatId } : null
  Rdo_subcategory.find(query).sort('description')
    .then((subRdo) => {
      subRdo = subRdo.sort((a, b) => a.description.localeCompare(b.description, undefined, {
        numeric: true,
        sensitivity: 'base'
      }))
      res.status(200).json({
        subRdo
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
