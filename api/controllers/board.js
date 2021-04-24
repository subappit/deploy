/* eslint-disable */

const Rdo = require('../../models/rdo')
const User = require('../../models/user')
const { clearFile } = require('../../utils/utils')

const  deleteExpiredRDO = async (next)=> {
  await Rdo.deleteMany({expirationDate: { $lte: new Date().toUTCString()}})
    .then(()=> {
      console.log('Rdo scadute cancellate')
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.findFilteredRdos = async (req, res, next) => {
  const allFilteredRdo = []
  const queryFirst = {
    'regionOfInterest._id': req.query.regionOfInterestIdFirst,
    'rdos._id': req.query.rdoIdFirst,
    import: req.query.importsFirst
  }
  const querySecond = {}
  const queryThird = {}
  const querySecondNeedeed = req.query.regionOfInterestIdSecond != null
  if (querySecondNeedeed) {
    querySecond['regionOfInterest._id'] = req.query.regionOfInterestIdSecond,
    querySecond['rdos._id'] = req.query.rdoIdSecond,
    querySecond.import = req.query.importsSecond
  }
  const queryThirdNeedeed = req.query.regionOfInterestIdThird != null
  if (queryThirdNeedeed) {
    queryThird['regionOfInterest._id'] = req.query.regionOfInterestIdThird,
    queryThird['rdos._id'] = req.query.rdoIdThird,
    queryThird.import = req.query.importsThird
  }
  await deleteExpiredRDO(next)
  console.log('passo qui')
  Rdo.find(queryFirst).sort('createdAt')
    .then((rdos) => {
      rdos.forEach((rdo) => {
        allFilteredRdo.push(rdo)
      })
      if (querySecondNeedeed) {
        Rdo.find(querySecond).sort('createdAt')
          .then((rdos) => {
            rdos.forEach((rdo) => {
              allFilteredRdo.push(rdo)
            })
            if (queryThirdNeedeed) {
              Rdo.find(queryThird).sort('createdAt')
                .then((rdos) => {
                  rdos.forEach((rdo) => {
                    allFilteredRdo.push(rdo)
                  })
                  return res.status(200).json({
                    rdos: allFilteredRdo
                  })
                })
            } else {
              return res.status(200).json({ rdos: allFilteredRdo.flat() })
            }
          })
      } else {
        return res.status(200).json({ rdos: allFilteredRdo })
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.findAllRdos = async (req, res, next) => {
  await deleteExpiredRDO(next)
  console.log('passo qui')
  Rdo.find().sort('createdAt')
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
    .then((rdo) => User.findById(userId).then((user) => {
      user.loadedRdos.push(rdo)
      return user.save()
    }))
    .then(() => {
      res.status(200).json({ rdo })
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
  let findedRdo; let
    indexToUpdate
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
        if (loadedRdo._id == rdoId) {
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
      if (!rdo) {
        const error = new Error('Rdo non trovata')
        error.statusCode = 500
        throw error
      }
      clearFile(rdo.cmeFile.Key)
      rdo.images.forEach((image) => {
        clearFile(image.Key)
      })
      rdo.technicalFiles.forEach((techFile) => {
        clearFile(techFile.Key)
      })
      return Rdo.findByIdAndRemove(rdoId)
    })
    .then(() => User.findById(userId))
    .then((user) => {
      if (!user) {
        const error = new Error('Sessione scaduta')
        error.statusCode = 401
        throw error
      }
      user.loadedRdos.forEach((loadedRdo, index) => {
        if (loadedRdo._id == rdoId) {
          indexToRemove = index
        }
      })
      if (indexToRemove != null) {
        user.loadedRdos.splice(indexToRemove, 1)
      }
      return user.save()
    })
    .then(() => {
      res.status(200).json({ message: 'Rdo eliminata con successo!' })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
