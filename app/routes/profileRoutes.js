const router = require('express').Router()
const { authJWT } = require('../middlewares')

const authCheck = (req, res, next) => {
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
  } else {
    req.body.data.user_id = req.user.dataValues.user_id
    next()
  }
}

const adminRightsCheck = (req, res, next) => {
  authJWT.isAdmin(req, res, next)
}

router.get('/', authCheck, (req, res) => {
  res.send('Hello, user with ID ' + req.user_id)
})

router.get('/admin', [authCheck, adminRightsCheck], (req, res) => {
  res.send('Hello, admin with ID ' + req.user_id)
})

module.exports = router
