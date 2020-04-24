const router = require("express").Router()
const passport = require("passport")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const db = require("../models")
const User = db.user

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  })
  const payload = ticket.getPayload()
  const userid = payload["sub"]
  console.log("GOOGLE ID TOKEN SUCCESSFULLY AUTHENTICATED")
  console.log(payload)

  User.findOrCreate({
    where: { googleID: payload.sub },
    defaults: {
      email: payload.email,
      username: payload.name,
      googleID: userid,
      role: "user",
    },
  }).then((newUser) => {
    console.log("NEWUSER", newUser)
  })
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

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

router.post("/google", (req, res) => {
  console.log("IDTOKEN", req.body.user.tc.id_token)
  verify(req.body.user.tc.id_token).catch(console.error)
}),
  router.get(
    "/google/redirect",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/api/profile/")
    }
  )

module.exports = router
