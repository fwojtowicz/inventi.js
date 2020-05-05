const db = require('../models')
const config = require('../config/auth.config')
const Genre = db.genre
const Op = db.Sequelize.Op
const Book = db.book

exports.create = (req, res) => {
  if (!req.body.data.genre_name) {
    res.status(400).send({
      message: 'Genre name is needed',
    })
    return
  }

  Genre.findOrCreate({
    where: {
      genre_name: req.body.data.genre_name,
    },
    defaults: {
      genre_name: req.body.data.genre_name,
    },
  })
    .then((genreData) => {
      Book.findOne({
        where: {
          book_id: req.body.data.book_id,
        },
      }).then((bookData) => {
        console.log(genreData[0])
        bookData
          .addGenre(genreData[0])
          .then(() => console.log('ADDITIONAL GENRE', bookData))
        res.send(bookData)
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while adding a genre',
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
