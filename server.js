const express = require("express")
const bodyParser = require ("body-parser")
const cors = require ("cors")

const app = express()

var corsOptions = {
  origin: "http://localhost:3001"
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const db = require("./app/models")
db.sequelize.sync()

app.get("/", (req, res) => {
  res.json({message: "Welcome"})
})
require("./app/routes/bookRoutes")(app)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));



