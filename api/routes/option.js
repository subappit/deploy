const route = require('express').Router()
const optionController = require('../controllers/option')

route.get('/rdo_macrocategory', optionController.rdo_macro)
route.get('/rdo_category', optionController.rdo_cat)
route.get('/rdo_subcategory', optionController.rdo_subcat)

module.exports = route
