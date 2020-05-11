const router = require('express').Router()
const { authJWT } = require('../middlewares')

const authCheck = (req, res, next) => {
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
    // console.log("USERID", req.UserID)
  } else {
    req.body.data.user_id = req.user.dataValues.user_id
    next()
  }
}

const adminRightsCheck = (req, res, next) => {
  console.log('req', req.user_id)
  authJWT.isAdmin(req, res, next)
}

router.get('/', authCheck, (req, res) => {
  console.log('USERID', req.UserID)
  res.send('Hello, user with ID ' + req.user_id)
  // res.render("profile", { user: req.user })
})

router.get('/admin', [authCheck, adminRightsCheck], (req, res) => {
  res.send('Hello, admin with ID ' + req.user_id)
})

module.exports = router
