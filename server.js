const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
var whitelist = ["https://eurekajs.netlify.com", "http://localhost:8080"];

var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else callback(new Error("Not allowed by CORS"));
  }
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome in eureka.js" });
});

require("./app/routes/bookRoutes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
