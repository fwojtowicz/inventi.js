const db = require("../models")
const Book = db.books
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.data.isbn) {
    res.status(400).send({
      message: "isbn is required damn it",
    })
    return
  }

  const book = {
    isbn: req.body.data.isbn,
    title: req.body.data.title,
    author: req.body.data.author,
    publication_year: req.body.data.publication_year,
    place_of_publication: req.body.data.place_of_publication,
    publisher: req.body.data.publisher,
    genre: req.body.data.genre,
    language_of_original: req.body.data.language_of_original,
    language: req.body.data.language_of_original,
    whoLend: req.body.data.whoLend,
    whoBorrowed: req.body.data.whoBorrowed,
    isRequested: req.body.data.isRequested ? req.body.data.isRequested : 0,
  }

  Book.create(book)
    .then((data) => {
      res.send(data)
      console.log("SERVER HERE")
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occured while creating the book",
      })
    })
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
        message: err.message || "Error occurred while retrieving tutorials",
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
        message: "Error retrieving book with ID" + id,
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
          message: "Book was updated successfully",
        })
      } else {
        res.send({
          message: "Cannot update book with id " + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating book with id " + id,
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
          message: "Book was deleted successfully",
        })
      } else {
        res.send({
          message: "Cannot delete book with id" + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting book with id" + id,
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
        message: err.message || "Error occurred while deleting all books",
      })
    })
}

// exports.findAllBorrowed = (req,res) => {

// }
