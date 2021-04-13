/* eslint-disable */
const route = require('express').Router()

const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const AWS = require('aws-sdk')
const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')
const config = require('../../config')

const s3 = new AWS.S3({
  accessKeyId: config.env.AWS_ID,
  secretAccessKey: config.env.AWS_SECRET,
  signatureVersion: 'v4',
  region: 'eu-west-3'
})

const fileStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, '')
  }
})

const multerUploader = multer({ storage: fileStorage })
const upload = multerUploader.array('file')

route.post('/upload', upload, async (req, res) => {
  const files = []
  for (const file of req.files) {
    const myFile = file.originalname.split('.')
    const fileType = myFile[myFile.length - 1]
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${myFile[0]}.${fileType}`,
      Body: file.buffer
    }

    try {
      const data = await s3.upload(params).promise()
      files.push(data)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  res.status(200).json({ files })
})

route.get('/all', isAuth, userController.fetchUsers)
route.post('/update/:userId', isAuth, userController.updateLoggedUser)
route.post('/:userId', userController.updateRegisteringUser) // l'unica route senza isAuth middleware perché serve in fase di reg per fare upload del file sullo user
route.get('/:userId', isAuth, userController.fetchUser)
route.delete('/:userId', isAuth, userController.deleteUser)
route.post('/:userId/deletefiles', isAuth, userController.deleteUserFiles)
route.get('/file/:fileId', isAuth, userController.getFile)

module.exports = route
