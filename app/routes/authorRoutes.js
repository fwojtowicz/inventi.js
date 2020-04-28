const authors = require("../controllers/authorController")
var router = require("express").Router()
router.post("/", authors.create)
// app.use("/api/authors", router)

module.exports = router
