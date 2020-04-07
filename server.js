const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const authRoutes = require("./app/routes/authRoutes")
const profileRoutes = require("./app/routes/profileRoutes")
const cookieSession = require("cookie-session")
const passport = require("passport")
require("dotenv").config({ path: ".env" })

const app = express()

const passportSetup = require("./app/config/passport.config")
// var whitelist = ["https://eurekajs.netlify.com", "http://localhost:8080"]

// var corsOptions = {
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else callback(new Error("Not allowed by CORS"));
//   }
// };

app.set("view engine", "ejs")

app.use(
  cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth/", authRoutes)
app.use("/api/profile/", profileRoutes)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api", (req, res) => {
  res.render("home", { user: req.user })
})

// require("./app/routes/bookRoutes")(app)
const db = require("./app/models")

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
