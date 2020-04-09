const router = require("express").Router()
const { authJWT } = require("../middlewares")

const authCheck = (req, res, next) => {
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
    // console.log("USERID", req.UserID)
  } else {
    req.UserID = req.user.dataValues.id
    next()
  }
}

const adminRightsCheck = (req, res, next) => {
  console.log("req", req.UserID)
  authJWT.isAdmin(req, res, next)
}

router.get("/", authCheck, (req, res) => {
  console.log("USERID", req.UserID)
  res.send("Hello, user with ID " + req.UserID)
  // res.render("profile", { user: req.user })
})

router.get("/admin", [authCheck, adminRightsCheck], (req, res) => {
  res.send("Hello, admin with ID " + req.UserID)
})

module.exports = router
