const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutesLocal = require('./app/routes/authRoutesLocal')
const authRoutesOAuth = require('./app/routes/authRoutesOAuth')
const authorRoutes = require('./app/routes/authorRoutes')
const publisherRoutes = require('./app/routes/publisherRoutes')
const genreRoutes = require('./app/routes/genreRoutes')
const categoryRoutes = require('./app/routes/categoryRoutes')
const bookDetailsRoutes = require('./app/routes/bookDetailsRoutes')
const bookRoutes = require('./app/routes/bookRoutes')

const profileRoutes = require('./app/routes/profileRoutes')
const cookieSession = require('cookie-session')
const passport = require('passport')
require('dotenv').config({ path: '.env' })

const app = express()

// app.use("*", (req, res, next) => {
//   if (req.method == "OPTIONS") {
//     res.status(200)
//     res.send()
//   } else {
//     next()
//   }
// })

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080/login")
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,POST,OPTIONS,PUT,PATCH,DELETE"
//   )
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
//   res.header("Access-Control-Allow-Credentials", true)

//   next()
// })

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

require('./app/routes/authRoutesLocal')(app)
const passportSetup = require('./app/config/passport.config')

// require("./app/routes/bookRoutes")(app)
// require("./app/routes/userRoutes")(app)

app.set('view engine', 'ejs')

app.use(
  cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth/', authRoutesOAuth)
app.use('/api/profile/', profileRoutes)
app.use('/api/authors/', authorRoutes)
app.use('/api/publishers/', publisherRoutes)
app.use('/api/genres/', genreRoutes)
app.use('/api/categories/', categoryRoutes)
app.use('/api/bookdetails/', bookDetailsRoutes)
app.use('/api/books/', bookRoutes)

app.get('/api', (req, res) => {
  res.render('home', { user: req.user })
})

const db = require('./app/models')
const Role = db.role

db.sequelize.sync({ force: true }).then(() => {
  // initial()
  //force:true
})

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   })
//   Role.create({
//     id: 2,
//     name: "admin",
//   })
// }

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
