const router = require('express').Router()
const passport = require('passport')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const db = require('../models')
const User = db.user
var jwt = require('jsonwebtoken')
const config = require('../config/auth.config')

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  return ticket
}

const checkGoogleAccount = async (ticket) => {
  const payload = ticket.getPayload()
  const userid = payload['sub']
  console.log('GOOGLE ID TOKEN SUCCESSFULLY AUTHENTICATED')
  const newUser = await User.findOrCreate({
    where: { googleID: userid },
    defaults: {
      email: payload.email,
      username: payload.name,
      googleID: userid,
    },
  })
  // newUser.setRoles([1])

  console.log('LOOK', newUser[0])

  var token = jwt.sign(
    { user_id: newUser[0].dataValues.user_id },
    config.secret,
    {
      expiresIn: 3600, //1h
    }
  )
  console.log('TOKEN', token)
  return { newUser: newUser, accessToken: token }
  // .then((newUser) => {
  // console.log("NEWUSER", newUser[0].dataValues.id)
  // })
}

router.get('/login', (req, res) => {
  res.render('login', { user: req.user })
})

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/api')
})

router.post('/google', (req, res) => {
  console.log('REQ', req.body.id_token)
  verify(req.body.id_token)
    .then((ticket) => {
      console.log('ticket', ticket)
      checkGoogleAccount(ticket)
        .then((obj) => res.send(obj))
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
