const router = require("express").Router()
const { authJWT } = require("../middlewares")
const controller = require("../controllers/userController")

const authCheck = (req, res, next) => {
  console.log("REQ", req)
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
    // console.log("USERID", req.UserID)
  } else {
    req.UserID = req.user.dataValues.id
    next()
  }
}

router.get("/", authCheck, (req, res) => {
  console.log("USERID", req.UserID)
  res.send("Hello, user with ID " + req.UserID)
  // res.render("profile", { user: req.user })
})

router.get(
  "/api/admin",
  [authJWT.verifyToken, authJWT.isAdmin],
  controller.adminBoard
)

module.exports = router
