const db = require("../models")
const Book = db.books
const Op = db.Sequelize.Op

exports.create = (req,res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Title is required"
    })
    return
  }

  const book =  {
    isbn: req.body.isbn,
    title: req.body.title ,
    author: req.body.author,
    publication_year: req.body.publication_year,
    place_of_publication: req.body.place_of_publication,
    publisher: req.body.publisher,
    genre: req.body.genre,
    language_of_original: req.body.language_of_original,
    language: req.body.language_of_original,
    whoLend: req.body.whoLend,
    whoBorrowed: req.body.whoBorrowed,
    isRequested: req.body.isRequested ? req.body.isRequested : false
  }

  Book.create(book)
  .then(data => {
    res.send(data)
  }).catch(err => {
    res.status(500).send({
      message:
      err.message || "Error occured while creating the book"
    })
  })
}

exports.findAll = (req, res) => {
  const title = req.query.title
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Book.findAll({whete: condition}) 
  .then(data => {
    res.send(data)
  }).catch(err=> {
    res.status(500).send({
      message:
      err.message || "Error occurred while retrieving tutorials"
    })
  })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Book.findByPk(id)
  .then(data => {
    res.send(data)
  }).catch(err => {
    res.status(500).send({
      message: "Error retrieving book with ID" + id
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id
  Book.update(req.body, {
    where: {id: id}
  }) 
  .then (num => {
    if (num == 1) {
      res.send({
        message: "Book was updatewd successfully"
      })
    }
    else {
      res.send ({
        message: "Cannot update book with id" + id
      })
    }
  }).catch(err => {
    res.status(500).send({
      message: "Error updating book with id" +id
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Book.destroy({
    where: {id: id}
  }).then(num => {
    if(num == 1) {
      res.send({
        message: "Book was deleted successfully"
      })
    } else {
      res.send({
        message: "Cannot delete book with id" + id
      })
    }
  }).catch(err => {
    res.status(500).send({
      message: "Error deleting book with id" + id
    })
  })
}

exports.deleteAll = (req, res) => {
  Book.destroy({
    where: {},
    truncate: false
  })
  .then(nums => {
    res.send({message: `{nums} Books were deleted successfully`})
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error occurred while deleting all books"
    })
  })
}

// exports.findAllBorrowed = (req,res) => {

// }
