const router = require("express").Router()
const { authJWT } = require("../middlewares")
const controller = require("../controllers/userController")

const authCheck = (req, res, next) => {
  console.log("REQ", req)
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
    res.redirect("/api/auth/login")
  } else next()
}

router.get("/", authCheck, (req, res) => {
  res.send("hereiam")
  // res.render("profile", { user: req.user })
})

router.get(
  "/api/admin",
  [authJWT.verifyToken, authJWT.isAdmin],
  controller.adminBoard
)

module.exports = router
