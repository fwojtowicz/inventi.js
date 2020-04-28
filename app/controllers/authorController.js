const db = require('../models')
const config = require('../config/auth.config')
const Author = db.author
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.data.author_name) {
    res.status(400).send({
      message: 'Author name is needen',
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
      console.log('SERVER HERE')
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while creating an author',
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Author.findByPk(id)
    .then((data) => {
      if (!data.body) res.status(404)
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving author with ID' + id,
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id
  Author.update(req.body.data, {
    where: { author_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Author was updated successfully',
        })
      } else {
        res.send({
          message: 'Cannot update Author with id ' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating author with id ' + id,
      })
    })
}
