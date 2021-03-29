/* eslint-disable */
const User = require('../../models/user')
const { clearFile } = require('../../utils/utils')
const Rdo = require('../../models/rdo')

const update = (req, res, next, loggedIn) => {
  const { userId } = req.params
  User.findByIdAndUpdate(userId, req.body, {
    overwrite: false,
    new: true
  }).select(['-payed', '-admin'])
    .then((user) => {
      res.status(200).json({ user, message: loggedIn ? 'Utente aggiornato con successo!' : undefined })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

const clearAllFile = (user) => {
  if (user.soaFile) {
    clearFile(user.soaFile.path)
  }
  if (user.isoFile) {
    clearFile(user.isoFile.path)
  }
  if (user.fgasFile) {
    clearFile(user.fgasFile.path)
  }
  if (user.antimafiaFile) {
    clearFile(user.antimafiaFile.path)
  }
  if (user.lendingFile) {
    clearFile(user.lendingFile.path)
  }
  if (user.certificateFile) {
    clearFile(user.certificateFile.path)
  }
  if (user.durcRegolarityFile) {
    clearFile(user.durcRegolarityFile.path)
  }
}

exports.updateRegisteringUser = (req, res, next) => {
  update(req, res, next, false)
}

exports.updateLoggedUser = (req, res, next) => {
  update(req, res, next, true)
}

exports.fetchUser = (req, res, next) => {
  const { userId } = req.params
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Sessione scaduta')
        error.statusCode = 401
        throw error
      }
      res.status(200).json({ user })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.fetchUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.deleteUser = (req, res, next) => {
  const { userId } = req.params
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Impossibile trovare l\'utente.')
        error.statusCode = 404
        throw error
      }

      clearAllFile(user)

      const idList = user.loadedRdos.map((rdo) => rdo._id)
      return Rdo.deleteMany({
        '_id': {$in: idList}
      })

    })
    .then(() => {
        return User.findByIdAndRemove(userId)
    })
    .then(() => {
      res.status(200).json({ message: 'Utente eliminato con successo!' })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.deleteUserFiles = (req, res, next) => {
  const { userId } = req.params
  const { body } = req
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Impossibile trovare l\'utente.')
        error.statusCode = 404
        throw error
      }
      body.forEach((filePath) => {
        clearFile(filePath)
      })
      res.status(200).json({})
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
