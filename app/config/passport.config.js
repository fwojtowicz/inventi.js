const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const db = require("../models")
const User = db.users

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      //   console.log("passport callback")
      //   console.log(profile)

      const user = {
        email: profile.emails[0].value,
        username: profile.displayName,
        googleID: profile.id,
      }
      User.create(user)
    }
  )
)
