// const { authJWT } = require("../middlewares")
// const controller = require("../controllers/userController")

// module.exports = function (app) {
//   app.use(function (req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     )
//     next()
//   })

//   app.get("/api", (req, res) => {
//     res.render("home", { user: req.user })
//   })

//   //   app.get("/api/profile", [authJWT.verifyToken], controller.userBoard)

//   app.get(
//     "/api/test/admin",
//     [authJWT.verifyToken, authJWT.isAdmin],
//     controller.adminBoard
//   )
// }
