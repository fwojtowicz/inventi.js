const db = require('../models')
const Book = db.book
const config = require('../config/auth.config')
const Author = db.author
const Publisher = db.publisher
const Genre = db.genre
const Category = db.category
const BookDetails = db.bookDetails
const OwnedBook = db.ownedBook
const Op = db.Sequelize.Op
const User = db.user

exports.create = (req, res) => {
  if (!req.body.data.title) {
    res.status(400).send({
      message: 'Title is required',
    })
    return
  }

  BookDetails.findOrCreate({
    where: {
      isbn: req.body.data.isbn,
    },
    defaults: {
      isbn: req.body.data.isbn,
      title: req.body.data.title,
      publication_year: req.body.data.publication_year,
      place_of_publication: req.body.data.place_of_publication,
      language_of_original: req.body.data.language_of_original,
      language: req.body.data.language_of_original,
    },
  })
    .then((bookDetailsData) => {
      if (!bookDetailsData) {
        throw new Error('Book details error')
      }
      Publisher.findOrCreate({
        where: {
          publisher_name: req.body.data.publisher_name,
        },
        defaults: {
          publisher_name: req.body.data.publisher_name,
        },
      })
        .then((publisherData) => {
          if (!publisherData) {
            throw new Error('Publisher details error')
          }
          Category.findOrCreate({
            where: {
              category_name: req.body.data.category_name,
            },
            defaults: {
              category_name: req.body.data.category_name,
            },
          })
            .then((categoryData) => {
              if (!categoryData) {
                throw new Error('Category error')
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
                  if (!genreData) {
                    throw new Error('Genre details error')
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
                    .then((authorData) => {
                      if (!authorData) {
                        throw new Error('Author details error')
                      }
                      // console.log('TESTAUTHORS', authorData)

                      Book.findOrCreate({
                        where: {
                          book_details_id:
                            bookDetailsData[0].dataValues.book_details_id,
                        },
                        defaults: {
                          author_id: authorData[0].dataValues.author_id,
                          publisher_id:
                            publisherData[0].dataValues.publisher_id,
                          genre_id: genreData[0].dataValues.genre_id,
                          category_id: categoryData[0].dataValues.category_id,
                          book_details_id:
                            bookDetailsData[0].dataValues.book_details_id,
                        },
                      })
                        .then((bookData) => {
                          // console.log('PROTO', Book.prototype)
                          // console.log('USERPROTO', User.prototype)
                          // console.log('Book Data', bookData)
                          // console.log('Author Data', authorData)
                          // console.log('Genre Data', genreData)
                          // console.log('Category Data', categoryData)
                          // console.log('Publisher Data', categoryData)

                          if (genreData[0].dataValues.genre_name) {
                            // console.log('Genre from Genre Model', genreData[0])
                            bookData[0]
                              .setGenres(genreData[0])
                              .then(() => console.log('GENRE', bookData))
                          }
                          if (authorData[0].dataValues.author_id) {
                            // console.log(
                            //   'Author from Author Model',
                            //   authorData[0]
                            // )
                            bookData[0]
                              .setAuthors(authorData[0])
                              .then(() => console.log('AUTHOR', bookData))
                          }
                          if (categoryData[0].dataValues.category_name) {
                            // console.log(
                            //   'Category from Category Model',
                            //   authorData[0]
                            // )
                            bookData[0]
                              .setCategory(categoryData[0])
                              .then(() => console.log('CATEGORY', bookData))
                          }
                          if (publisherData[0].dataValues.category_id) {
                            // console.log(
                            //   'Publisher from Publisher Model',
                            //   publisherData[0]
                            // )
                            bookData[0]
                              .setPublisher(publisherData[0])
                              .then(() => console.log('PUBLISHER', bookData))
                          }
                          if (bookDetailsData[0].dataValues.book_details_id) {
                            // console.log('Book Details from Book Details Model')
                            bookData[0]
                              .setBookDetail(bookDetailsData[0])
                              .then(() => console.log('BOOKDATA', bookData))
                          }
                          console.log('BOOK DATA', bookData)

                          OwnedBook.findOrCreate({
                            where: {
                              book_id: bookData[0].dataValues.book_id,
                            },
                            defaults: {
                              book_id: bookData[0].dataValues.book_id,
                              when_bought: req.body.data.when_bought,
                              owned_book_price: req.body.owned_book_price,
                              was_a_gift: req.body.data.was_a_gift,
                              comment: req.body.data.comment,
                            },
                          })
                            .then((ownedBookData) => {
                              if (ownedBookData[0]._options.isNewRecord) {
                                const userID = req.body.data.user_id
                                User.findByPk(userID)
                                  .then((userData) => {
                                    userData
                                      .addOwnedBook(ownedBookData[0])
                                      .then((response) => {
                                        console.log('USER DATA', userData),
                                          res.status(200).send({
                                            message: response,
                                          })
                                      })
                                  })
                                  .catch((err) => {
                                    res.status(500).send({
                                      message:
                                        err.message ||
                                        'Error occurred creating owned book',
                                    })
                                  })
                              } else
                                res.status(400).send({
                                  message:
                                    'Such book already exists in your collection',
                                })
                            })
                            .catch((err) => {
                              res.status(500).send({
                                message:
                                  err.message ||
                                  'Error occurred creating owned book',
                              })
                            })
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message:
                              err.message ||
                              'Error occurred creating book in DB',
                          })
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message:
                              err.message ||
                              'Error occured while creating the book',
                          })
                        })
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message || 'Error occurred creating author',
                      })
                    })
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || 'Error occurred creating genre',
                  })
                })
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || 'Error occurred creating category',
              })
            })
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Error occurred creating publisher',
          })
        })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred creating book',
      })
    })
}

exports.findAll = (req, res) => {
  const title = req.query.title
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null
  const userID = req.body.data.user_id

  User.findByPk(userID).then((userData) => {
    userData
      .getOwnedBooks({
        include: [
          {
            model: Book,
            include: [
              {
                model: Author,
              },
              {
                model: Genre,
              },
              {
                model: Category,
              },
              {
                model: Publisher,
              },
              {
                model: BookDetails,
              },
            ],
          },
        ],
      })
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Error occurred while retrieving owned books',
        })
      })
  })
}

exports.findOne = (req, res) => {
  console.log('FINDONE')
  const id = req.params.id
  console.log('ID', id)

  OwnedBook.findByPk(id, {
    // include: [
    //   {
    //     model: Author,
    //   },
    //   {
    //     model: Genre,
    //   },
    //   {
    //     model: Category,
    //   },
    //   {
    //     model: Publisher,
    //   },
    //   {
    //     model: BookDetails,
    //   },
    // ],
  })
    .then((data) => {
      if (!data) {
        res.status(404)
      }
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving owned book with ID ' + id,
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id

  OwnedBook.update(
    {
      when_bought: req.body.data.when_bought,
      owned_book_price: req.body.data.owned_book_price,
      was_a_gift: req.body.data.was_a_gift,
      comment: req.body.data.comment,
    },
    {
      where: { owned_book_id: id },
    }
  )

  OwnedBook.findByPk(id)
    .then((ownedBookData) => {
      console.log(ownedBookData)
      Book.findByPk(ownedBookData.dataValues.book_id).then((bookData) => {
        BookDetails.update(
          {
            isbn: req.body.data.isbn,
            title: req.body.data.title,
            publication_year: req.body.data.publication_year,
            place_of_publication: req.body.data.place_of_publication,
            language_of_original: req.body.data.language_of_original,
            language: req.body.data.language,
          },
          { where: { book_details_id: bookData.dataValues.book_details_id } }
        )
        Author.update(
          {
            author_name: req.body.data.author_name,
            author_surname: req.body.data.author_surname,
          },
          { where: { author_id: bookData.dataValues.author_id } }
        )
        Publisher.update(
          { publisher_name: req.body.data.publisher_name },
          { where: { publisher_id: bookData.dataValues.publisher_id } }
        )
        Genre.update(
          { genre_name: req.body.data.genre_name },
          { where: { genre_id: bookData.dataValues.genre_id } }
        )
        Category.update(
          { category_name: req.body.data.category_name },
          { where: { category_id: bookData.dataValues.category_id } }
        )
      })
    })
    .then(res.send({ message: 'Owned Book updated successfully' }))
    .catch((err) => {
      res.send({ message: err })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id
  OwnedBook.destroy({
    where: { owned_book_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Owned book with id ' + id + ' was deleted successfully',
        })
      } else {
        res.send({
          message: 'Cannot delete owned book with id ' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error deleting owned book with id ' + id,
      })
    })
}
