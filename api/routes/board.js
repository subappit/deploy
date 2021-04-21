const route = require('express').Router()
const boardController = require('../controllers/board')
const isAuth = require('../middleware/is-auth')

route.get('/rdo', isAuth, boardController.findFilteredRdos)
route.get('/rdo/all', isAuth, boardController.findAllRdos)
route.get('/rdo/:rdoId', isAuth, boardController.findOneRdo)
route.post('/rdo/:userId', isAuth, boardController.insertRdo)
route.put('/rdo/:rdoId/:userId', isAuth, boardController.updateRdo)
route.delete('/rdo/:rdoId/:userId', isAuth, boardController.deleteRdo)

module.exports = route
