const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const db = require("../models")
const User = db.user

passport.serializeUser((user, done) => {
  done(null, user[0].dataValues.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOrCreate({
        where: { googleID: profile.id },
        defaults: {
          email: profile.emails[0].value,
          username: profile.displayName,
          googleID: profile.id,
        },
      }).then((newUser) => {
        console.log("NEWUSER", newUser[0].dataValues.id)
        done(null, newUser)
      })
    }
  )
)
