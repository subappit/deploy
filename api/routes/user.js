/* eslint-disable max-len */
const route = require('express').Router()

const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    if (file.originalname === 'images') {
      cb(null, `${uuidv4()}.png`)
    } else {
      cb(null, `${uuidv4()}.pdf`)
    }
  }
})

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.pdf' && ext !== '.jpeg') {
    return callback(new Error('Formato file non supportato!'))
  }
  callback(null, true)
}

const multerUploader = multer({ storage: fileStorage, filter: fileFilter })
const upload = multerUploader.array('file')

route.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err)
    } else if (err) {
      console.log(err)
    }
    return res.send(req.files)
  })
})

route.get('/all', isAuth, userController.fetchUsers)
route.post('/update/:userId', isAuth, userController.updateLoggedUser)
route.post('/:userId', userController.updateRegisteringUser) // l'unica route senza isAuth middleware perché serve in fase di reg per fare upload del file sullo user
route.get('/:userId', isAuth, userController.fetchUser)
route.delete('/:userId', isAuth, userController.deleteUser)
route.post('/:userId/deletefiles', isAuth, userController.deleteUserFiles)

module.exports = route
