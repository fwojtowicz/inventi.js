const router = require("express").Router()
const { authJWT } = require("../middlewares")
const controller = require("../controllers/userController")

const authCheck = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!req.user) {
    if (!token) {
      res
        .status(403)
        .send({
          message: "No token provided",
        })
        .redirect("/api/auth/login")
    } else next()
  } else next()
}

router.get("/", authCheck, (req, res) => {
  if (req.user) res.render("profile", { user: req.user })
  else res.status(200).send("User Content.")
})

router.get(
  "/api/admin",
  [authJWT.verifyToken, authJWT.isAdmin],
  controller.adminBoard
)

module.exports = router
