const db = require('../models')
const config = require('../config/auth.config')
const Genre = db.genre
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.data.genre_name) {
    res.status(400).send({
      message: 'Genre name is needed',
    })
    return
  }

  const genre_name = {
    genre_name: req.body.data.genre_name,
  }

  Genre.findOrCreate({
    where: {
      genre_name: req.body.data.genre_name,
    },
    defaults: {
      genre_name: req.body.data.genre_name,
    },
  })
    .then((data) => {
      res.send(data)
      console.log('SERVER HERE')
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while creating a genre',
      })
    })
}

// exports.findOne = (req, res) => {
//   const id = req.params.id

//   Author.findByPk(id)
//     .then((data) => {
//       if (!data.body) res.status(404)
//       res.send(data)
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Error retrieving author with ID' + id,
//       })
//     })
// }

exports.update = (req, res) => {
  const id = req.params.id
  Genre.update(req.body.data, {
    where: { genre_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Category was updated successfully',
        })
      } else {
        res.send({
          message: 'Cannot update category with id ' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating category with id ' + id,
      })
    })
}
