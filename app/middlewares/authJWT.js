const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")
const db = require("../models")
const User = db.user

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]
  if (!token) {
    return res.redirect("/api/auth/login")
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.redirect("/api/auth/login")
      // return res.status(401).send({
      //   message: "Unauthorized",
      // })
    }
    req.UserID = decoded.id
    next()
  })
}

isAdmin = (req, res, next) => {
  console.log("CALLED", req.UserID)
  User.findByPk(req.UserID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          console.log("isAdmin!!!")
          next()
          return
        }
      }
      res.status(403).send({
        message: "Require Admin Role!",
      })
      return
    })
  })
}

const authJWT = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
}

module.exports = authJWT