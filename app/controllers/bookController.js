const db = require('../models')
const Book = db.book
const config = require('../config/auth.config')
const Author = db.author
const Publisher = db.publisher
const Genre = db.genre
const Category = db.category
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  // if (!req.body.data.isbn) {
  //   res.status(400).send({
  //     message: 'isbn is required damn it',
  //   })
  //   return
  // }

  const author = {
    author_name: req.body.data.author_name,
    author_surname: req.body.data.author_surname,
  }
  const publisher = {
    publisher_name: req.body.data.publisher_name,
  }

  const genre = {
    genre_name: req.body.data.genre_name,
  }
  const category = {
    category_name: req.body.data.category_name,
  }

  Genre.findOrCreate({
    where: {
      genre_name: req.body.data.genre_name,
    },
    defaults: {
      genre_name: req.body.data.genre_name,
    },
  }).then((genreData) => {
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
    }).then((authorData) => {
      console.log('HEHEHEHHEHEH', authorData[0].dataValues)
      const authors = []
      const book = {
        author_id: authorData[0].dataValues.author_id,
        publisher_id: req.body.data.publisher_id,
        genre_id: genreData[0].dataValues.genre_id,
        // category_id: categoryData.dataValues.category_id,
        book_details_id: req.body.data.book_details_id,
      }
      Book.create(book)
        .then((books) => {
          // console.log('PROTO', Book.prototype)

          console.log('Author Data', authorData)
          console.log('Genre Data', genreData)
          if (genreData[0].dataValues.genre_name) {
            console.log('Genre from Genre Model', genreData[0])
            books
              .setGenres(genreData[0])
              .then(() => console.log('GENRE', books))

            console.log(
              'Author Surname',
              authorData[0].dataValues.author_surname
            )
            console.log('Author from Author Model', authorData[0])
            books
              .setAuthors(authorData[0])
              .then(() => console.log('FINAL', books))

            // if (authorData[0].dataValues.author_surname) {
            //   Author.findAll({
            //     where: {
            //       [Op.and]: [
            //         { author_name: req.body.data.author_name },
            //         { author_surname: req.body.data.author_surname },
            //       ],
            //     },
            //   })
            // Author.findOrCreate({
            //   where: {
            //     [Op.and]: [
            //       { author_name: req.body.data.author_name },
            //       { author_surname: req.body.data.author_surname },
            //     ],
            //   },
            //   defaults: {
            //     author_name: req.body.data.author_name,
            //     author_surname: req.body.data.author_surname,
            //   },
            // })
            //     .then((author) => {
            //       console.log('Author from Author Model', author)
            //       books
            //         .setAuthors(author)
            //         .then(() => console.log('FINAL', books))
            //     })
            // }
          }
          // res.send(data)
          console.log('SERVER HERE')
          res.send(200)
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Error occured while creating the book',
          })
        })
    })
  })
  // Book.findAll({ include: Author }).then((res) => {
  //   console.log('HERE', JSON.stringify(res, null, 2))
  // })
}

exports.findAll = (req, res) => {
  const title = req.query.title
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null

  Book.findAll({
    include: [
      {
        model: Author,
      },

      {
        model: Genre,
      },
    ],
  })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving tutorials',
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Book.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving book with ID' + id,
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id
  Book.update(req.body.data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Book was updated successfully',
        })
      } else {
        res.send({
          message: 'Cannot update book with id ' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating book with id ' + id,
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Book.destroy({
    where: { book_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Book was deleted successfully',
        })
      } else {
        res.send({
          message: 'Cannot delete book with id' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error deleting book with id' + id,
      })
    })
}

exports.deleteAll = (req, res) => {
  Book.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `{nums} Books were deleted successfully` })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred while deleting all books',
      })
    })
}

// exports.findAllBorrowed = (req,res) => {

// }
