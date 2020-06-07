const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutesOAuth = require('./app/routes/authRoutesOAuth')
const bookRoutes = require('./app/routes/bookRoutes')
const loanRoutes = require('./app/routes/loanRoutes')
const profileRoutes = require('./app/routes/profileRoutes')
const mailerRoutes = require('./app/routes/mailerRoutes')
const userRoutes = require('./app/routes/userRoutes')

const cookieSession = require('cookie-session')
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

app.set('view engine', 'ejs')

app.use(
  cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET]
  })
)

app.use('/api/auth/', authRoutesOAuth)
app.use('/api/profile/', profileRoutes)
app.use('/api', mailerRoutes)
app.use('/api/users/', userRoutes)
app.use('/api/books/', bookRoutes)
app.use('/api/loans/', loanRoutes)

app.get('/api', (req, res) => {
  res.render('home', { user: req.user })
})

const db = require('./app/models')
const Role = db.role

db.sequelize.sync({ force: true }).then(() => {
  initial()
})

function initial() {
  Role.create({
    id: 1,
    name: 'user'
  })
  Role.create({
    id: 2,
    name: 'admin'
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
