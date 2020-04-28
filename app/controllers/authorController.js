const db = require("../models")
const config = require("../config/auth.config")
const Author = db.author
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.data.author_name) {
    res.status(400).send({
      message: "Author name is needen",
    })
    return
  }

  const author = {
    author_name: req.body.data.author_name,
    author_surname: req.body.data.author_surname,
  }

  Author.findOrCreate({
    where: {
      [Op.and]: [
        { author_name: req.body.data.author_name },
        { author_surname: req.body.data.author_surname },
      ],
    },
    defaults: {
      author_name: req.body.data.author_name,
      author_surname: req.body.data.author_surname,
    },
  })
    .then((data) => {
      res.send(data)
      console.log("SERVER HERE")
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occured while creating an author",
      })
    })
}
