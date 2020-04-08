const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")
const db = require("../models")
const User = db.user

verifyToken = (req, res, next) => {
  console.log("REQEST", req)
  let token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      })
    }
    req.UserID = decoded.id
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findByPK(req.UserID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
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
