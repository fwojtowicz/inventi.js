const router = require("express").Router()
const passport = require("passport")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const db = require("../models")
const User = db.user

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  return ticket
}

const checkGoogleAccount = async (ticket) => {
  const payload = ticket.getPayload()
  const userid = payload["sub"]
  console.log("GOOGLE ID TOKEN SUCCESSFULLY AUTHENTICATED")
  const newUser = await User.findOrCreate({
    where: { googleID: userid },
    defaults: {
      email: payload.email,
      username: payload.name,
      googleID: userid,
      role: "user",
    },
  })
  return newUser
  // .then((newUser) => {
  // console.log("NEWUSER", newUser[0].dataValues.id)
  // })
}

router.get("/login", (req, res) => {
  res.render("login", { user: req.user })
})

router.get("/logout", (req, res) => {
  req.logOut()
  res.redirect("/api")
})

router.post("/google", (req, res) => {
  verify(req.body.user.tc.id_token + "jdbhjhdasbkhdabsjhgvdttyaew")
    .then((ticket) => {
      console.log("ticket", ticket)
      checkGoogleAccount(ticket)
        .then((user) => res.send(user))
        .catch(console.error)
      // .then((newUser) => {
      //   console.log("fuck", newUser)
      // })
      // .catch(console.error)
    })
    .catch(console.error)
  // console.log("RESULT", result)
  // res.send(result)
})
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// )
// router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
//   res.redirect("/api/profile/")
// })

module.exports = router
