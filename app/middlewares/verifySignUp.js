const db = require('../models')
const ROLES = db.ROLES
const User = db.user

checkDuplicates = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then((user) => {
    if (user != null) {
      res.status(400).send({
        message: 'Username already in use'
      })
      return
    }

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: 'E-mail address already in use'
        })
        return
      }
      next()
    })
  })
}

checkRoles = (req, res, next) => {
  if (req.body.roles) {
    if (req.body.roles.some((role) => ROLES.indexOf(role) == -1)) {
      res.status(400).send({
        message: 'Role does not exist'
      })
      return
    }
  }
  next()
}

const verifySignUp = {
  checkDuplicates: checkDuplicates,
  checkRoles: checkRoles
}

module.exports = verifySignUp
