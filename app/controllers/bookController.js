const db = require('../models')
const Book = db.book
const config = require('../config/auth.config')
const Author = db.author
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  // if (!req.body.data.isbn) {
  //   res.status(400).send({
  //     message: 'isbn is required damn it',
  //   })
  //   return
  // }

  const book = {
    author_id: req.body.data.author_id,
    publisher_id: req.body.data.publisher_id,
    genre_id: req.body.data.genre_id,
    category_id: req.body.data.category_id,
    book_details_id: req.body.data.book_details_id,
  }

  Book.create(book)
    .then((books) => {
      console.log(Book.prototype)
      console.log('DAYA', books.dataValues.author_id)
      if (books.dataValues.author_id) {
        Author.findAll({
          where: { author_id: books.dataValues.author_id },
        }).then((author) => {
          console.log('AUHOOOR', author)
          books.setAuthors(author).then(() => console.log('FINAL', books))
        })
      }
      // res.send(data)
      console.log('SERVER HERE')
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while creating the book',
      })
    })

  // Book.findAll({ include: Author }).then((res) => {
  //   console.log('HERE', JSON.stringify(res, null, 2))
  // })
}

exports.findAll = (req, res) => {
  const title = req.query.title
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null

  Book.findAll({ where: condition })
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
    where: { id: id },
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
