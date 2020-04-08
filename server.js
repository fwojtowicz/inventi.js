const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const authRoutesLocal = require("./app/routes/authRoutesLocal")
const authRoutesOAuth = require("./app/routes/authRoutesOAuth")

const profileRoutes = require("./app/routes/profileRoutes")
const cookieSession = require("cookie-session")
const passport = require("passport")
require("dotenv").config({ path: ".env" })

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// var whitelist = ["https://eurekajs.netlify.com", "http://localhost:8080"]

// var corsOptions = {
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else callback(new Error("Not allowed by CORS"));
//   }
// };

const passportSetup = require("./app/config/passport.config")

// require("./app/routes/bookRoutes")(app)
require("./app/routes/authRoutesLocal")(app)
require("./app/routes/userRoutes")(app)

app.set("view engine", "ejs")

app.use(
  cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth/", authRoutesOAuth)
app.use("/api/profile/", profileRoutes)

app.get("/api", (req, res) => {
  res.render("home", { user: req.user })
})

const db = require("./app/models")
const Role = db.role

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.")
  initial()
})

function initial() {
  Role.create({
    id: 1,
    name: "user",
  })
  Role.create({
    id: 2,
    name: "admin",
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
