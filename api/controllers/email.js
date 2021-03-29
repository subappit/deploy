/* eslint-disable no-param-reassign,no-underscore-dangle */
const sgMail = require('@sendgrid/mail')

exports.send = (req, res, next) => {
  const email = req.body
  sgMail
    .send(email)
    .then(() => {
      res.status(200).json({ message: 'Email inviata con successo. Ti risponderemo al più presto!' })
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500
      }
      next(error)
    })
}
