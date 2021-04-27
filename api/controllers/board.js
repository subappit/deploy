/* eslint-disable eqeqeq,no-underscore-dangle,prefer-const,no-restricted-syntax,no-await-in-loop,no-unused-expressions,no-sequences,max-len,no-param-reassign */
const Rdo = require('../../models/rdo')
const User = require('../../models/user')
const { clearFile } = require('../../utils/utils')

const removeRdo = async (rdoId, userId) => {
  let indexToRemove
  const rdo = await Rdo.findById(rdoId)
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
  await Rdo.findByIdAndRemove(rdoId)
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('Sessione scaduta')
    error.statusCode = 401
    throw error
  }
  user.loadedRdos.forEach((loadedRdo, index) => {
    if (loadedRdo._id.toString() === rdoId.toString()) {
      indexToRemove = index
    }
  })
  if (indexToRemove != null) {
    user.loadedRdos.splice(indexToRemove, 1)
  }
  await user.save()
}

const deleteExpiredRDO = async (next) => {
  try {
    const rdos = await Rdo.find({ expirationDate: { $lt: new Date() } })
    if (rdos.length > 0) {
      console.log('RDO scadute: ', rdos.length)
      for (let rdo of rdos) {
        console.log(`Rimuovendo rdoId ${rdo._id} dello userId: ${rdo.user._id}`)
        await removeRdo(rdo._id, rdo.user._id)
      }
    } else {
      console.log('Nessuna RDO scaduta.')
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
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
  try {
    const rdosFirst = await Rdo.find(queryFirst).sort('createdAt')
    rdosFirst.forEach((rdo) => {
      allFilteredRdo.push(rdo)
    })
    if (querySecondNeedeed) {
      const rdosSecond = await Rdo.find(querySecond).sort('createdAt')
      rdosSecond.forEach((rdo) => {
        allFilteredRdo.push(rdo)
      })
    }
    if (queryThirdNeedeed) {
      const rdosThird = await Rdo.find(queryThird).sort('createdAt')
      rdosThird.forEach((rdo) => {
        allFilteredRdo.push(rdo)
      })
    }
    res.status(200).json({ rdos: allFilteredRdo.flat() })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.findAllRdos = async (req, res, next) => {
  await deleteExpiredRDO(next)
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
    .then((rdoUpdated) => User.findById(userId).then((user) => {
      user.loadedRdos.push(rdoUpdated)
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
  let findedRdo
  let indexToUpdate
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
        if (loadedRdo._id.toString() === rdoId.toString()) {
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

exports.deleteRdo = async (req, res, next) => {
  const { rdoId } = req.params
  const { userId } = req.params
  try {
    await removeRdo(rdoId, userId)
    res.status(200).json({ message: 'Rdo eliminata con successo!' })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
