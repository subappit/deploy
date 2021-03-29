/* eslint-disable */
const Rdo = require('../../models/rdo')
const User = require('../../models/user')
const { clearFile } = require('../../utils/utils')


exports.findAllRdos = (req, res, next) => {
  Rdo.find(req.query).sort('createdAt')
    .then((rdos) => {
      res.status(200).json({
        rdos
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.findOneRdo = (req, res, next) => {
  const { rdoId } = req.params
  Rdo.findById(rdoId)
    .then((rdo) => {
      res.status(200).json({
        rdo
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.insertRdo = (req, res, next) => {
    const { body } = req
    const { userId } = req.params
    const rdo = new Rdo(body)
    return rdo.save()
    .then((rdo) => {
      return User.findById(userId).then((user) => {
        user.loadedRdos.push(rdo)
        return user.save()
      })
    })
    .then(() => {
      res.status(200).json({ message: 'Rdo caricata con successo!', rdo: rdo })
    })
    .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
    })
}

exports.updateRdo = (req, res, next) => {
    const { rdoId } = req.params
    const { userId } = req.params
    let findedRdo, indexToUpdate
    Rdo.findByIdAndUpdate(rdoId, req.body, {
        overwrite: false,
        new: true
    })
    .then((rdo) => {
        findedRdo = rdo
        return User.findById(userId)
    })
    .then((user) => {
        if (!user) {
          const error = new Error('Sessione scaduta')
          error.statusCode = 401
          throw error
        }
        user.loadedRdos.forEach((loadedRdo, index) => {
            if(loadedRdo._id == rdoId) {
                indexToUpdate = index
            }
        })
        if (indexToUpdate != null) {
            user.loadedRdos.splice(indexToUpdate, 1)
            user.loadedRdos.push(findedRdo)
        }

        return user.save()
    })
    .then(() => {
      res.status(200).json({})
    })
    .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.deleteRdo = (req, res, next) => {
    const { rdoId } = req.params
    const { userId } = req.params
    let indexToRemove
    Rdo.findById(rdoId)
        .then((rdo) => {
            if(!rdo) {
                const error = new Error('Rdo non trovata')
                error.statusCode = 500
                throw error
            }
            clearFile(rdo.cmeFile.path)
            rdo.images.forEach((image) => {
                clearFile(image.path)
            })
            rdo.technicalFiles.forEach((techFile) => {
                clearFile(techFile.path)
            })
            return Rdo.findByIdAndRemove(rdoId)
        })
        .then(()=> {
            return User.findById(userId)
        })
        .then((user) => {
            if (!user) {
                const error = new Error('Sessione scaduta')
                error.statusCode = 401
                throw error
            }
            user.loadedRdos.forEach((loadedRdo, index) => {
                if(loadedRdo._id == rdoId) {
                    indexToRemove = index
                }
            })
            if (indexToRemove != null) {
                user.loadedRdos.splice(indexToRemove, 1)
            }
            return user.save()
        })
        .then(()=> {
            res.status(200).json({message: 'Rdo eliminata con successo!'})
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}
