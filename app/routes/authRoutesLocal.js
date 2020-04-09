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
