const router = require("express").Router()
const passport = require("passport")

router.get("/login", (req, res) => {
  res.render("login", { user: req.user })
})

router.get("/logout", (req, res) => {
  req.logOut()
  res.redirect("/api")
})

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/api/profile/")
})

module.exports = router

const { verifySignUp } = require("../middlewares")
const controller = require("../controllers/authController")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicates, verifySignUp.checkRoles],
    controller.signup
  )

  app.post("/api/auth/signin", controller.signin)
}
