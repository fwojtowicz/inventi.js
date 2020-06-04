const db = require('../models')
const Book = db.book
const config = require('../config/auth.config')
const Author = db.author
const Publisher = db.publisher
const Genre = db.genre
const Category = db.category
const BookDetails = db.bookDetails
const OwnedBook = db.ownedBook
const Loan = db.loan
const Op = db.Sequelize.Op
const User = db.user

exports.create = (req, res) => {
  if (!req.body.data.title) {
    res.status(400).send({
      message: 'Title is required'
    })
    return
  }

  BookDetails.findOrCreate({
    where: {
      isbn: req.body.data.isbn
    },
    defaults: {
      isbn: req.body.data.isbn,
      title: req.body.data.title,
      publication_year: req.body.data.publication_year,
      place_of_publication: req.body.data.place_of_publication,
      language_of_original: req.body.data.language_of_original,
      language: req.body.data.language_of_original
    }
  })
    .then((bookDetailsData) => {
      if (!bookDetailsData) {
        throw new Error('Book details error')
      }
      Publisher.findOrCreate({
        where: {
          publisher_name: req.body.data.publisher_name
        },
        defaults: {
          publisher_name: req.body.data.publisher_name
        }
      })
        .then((publisherData) => {
          if (!publisherData) {
            throw new Error('Publisher details error')
          }
          Category.findOrCreate({
            where: {
              category_name: req.body.data.category_name
            },
            defaults: {
              category_name: req.body.data.category_name
            }
          })
            .then((categoryData) => {
              if (!categoryData) {
                throw new Error('Category error')
              }
              // Genre.findOrCreate({
              //   where: {
              //     genre_name: req.body.data.genre_name
              //   },
              //   defaults: {
              //     genre_name: req.body.data.genre_name
              //   }
              // })
              // Genre.bulkCreate(req.body.data.additionalGenres)
              var genres = req.body.data.additionalGenres
              genreData = []
              for (var g = 0; g < genres.length; g++) {
                var newGenresPromise = Genre.findOrCreate({
                  where: {
                    genre_name: genres[g].genre_name
                  },
                  defaults: {
                    genre_name: genres[g].genre_name
                  }
                })
                genreData.push(newGenresPromise)
              }
              return Promise.all(genreData)
                .then((genreData) => {
                  // console.log('jenre', genreData)
                  if (!genreData) {
                    throw new Error('Genre details error')
                  }
                  var authors = req.body.data.additionalAuthors
                  authorData = []
                  for (var i = 0; i < authors.length; i++) {
                    var newPromise = Author.findOrCreate({
                      where: {
                        [Op.and]: [
                          { author_name: authors[i].author_name },
                          { author_surname: authors[i].author_surname }
                        ]
                      },
                      defaults: {
                        author_name: authors[i].author_name,
                        author_surname: authors[i].author_surname
                      }
                    })
                    authorData.push(newPromise)
                  }
                  return (
                    Promise.all(authorData)
                      // Author.bulkCreate(req.body.data.additionalAuthors)
                      .then((authorData) => {
                        if (!authorData) {
                          throw new Error('Author details error')
                        }
                        // console.log('TESTAUTHORS', authorData)

                        Book.findOrCreate({
                          where: {
                            book_details_id:
                              bookDetailsData[0].dataValues.book_details_id
                          },
                          defaults: {
                            // author_id: authorData[0].dataValues.author_id,
                            publisher_id:
                              publisherData[0].dataValues.publisher_id,
                            // genre_id: genreData[0].dataValues.genre_id,
                            category_id: categoryData[0].dataValues.category_id,
                            book_details_id:
                              bookDetailsData[0].dataValues.book_details_id
                          }
                        })
                          .then((bookData) => {
                            if (genreData[0]) {
                              newGenreData = genreData
                              for (var h = 0; h < genreData.length; h++) {
                                var currG = newGenreData[h]
                                bookData[0].addGenre(currG[0])
                              }
                            }
                            if (authorData[0]) {
                              newAuthorData = authorData
                              for (var j = 0; j < authorData.length; j++) {
                                var currA = newAuthorData[j]
                                bookData[0].addAuthor(currA[0])
                              }
                            }
                            if (categoryData[0].dataValues.category_name) {
                              bookData[0].setCategory(categoryData[0])
                            }
                            if (publisherData[0].dataValues.publisher_id) {
                              bookData[0].setPublisher(publisherData[0])
                            }
                            if (bookDetailsData[0].dataValues.book_details_id) {
                              bookData[0].setBookDetail(bookDetailsData[0])
                            }

                            OwnedBook.findOrCreate({
                              where: {
                                book_id: bookData[0].dataValues.book_id
                              },
                              defaults: {
                                book_id: bookData[0].dataValues.book_id,
                                when_bought: req.body.data.when_bought,
                                owned_book_price: req.body.owned_book_price,
                                was_a_gift: req.body.data.was_a_gift,
                                comment: req.body.data.comment,
                                is_public: req.body.data.is_public
                              }
                            })
                              .then((ownedBookData) => {
                                // console.log('wlasciciel', ownedBookData[0])
                                if (
                                  ownedBookData[0].user_id != req.body.user_id
                                ) {
                                  const userID = req.body.user_id
                                  User.findByPk(userID)
                                    .then((userData) => {
                                      userData
                                        .addOwnedBook(ownedBookData[0])
                                        .then((response) => {
                                          // console.log('USER DATA', userData),
                                          res.status(200).send({
                                            message: response
                                          })
                                        })
                                    })
                                    .catch((err) => {
                                      res.status(500).send({
                                        message:
                                          err.message ||
                                          'Error occurred creating owned book'
                                      })
                                    })
                                } else
                                  res.status(400).send({
                                    message:
                                      'Such book already exists in your collection'
                                  })
                              })
                              .catch((err) => {
                                res.status(500).send({
                                  message:
                                    err.message ||
                                    'Error occurred creating owned book'
                                })
                              })
                          })
                          .catch((err) => {
                            res.status(500).send({
                              message:
                                err.message ||
                                'Error occurred creating book in DB'
                            })
                          })
                          .catch((err) => {
                            res.status(500).send({
                              message:
                                err.message ||
                                'Error occured while creating the book'
                            })
                          })
                      })
                      .catch((err) => {
                        res.status(500).send({
                          message:
                            err.message || 'Error occurred creating author'
                        })
                      })
                  )
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || 'Error occurred creating genre'
                  })
                })
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || 'Error occurred creating category'
              })
            })
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Error occurred creating publisher'
          })
        })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred creating book'
      })
    })
}

exports.findAll = (req, res) => {
  const title = req.query.title
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null
  const userID = req.user_id

  User.findByPk(userID).then((userData) => {
    userData
      .getOwnedBooks({
        include: [
          {
            model: Book,
            include: [
              {
                model: Author
              },
              {
                model: Genre
              },
              {
                model: Category
              },
              {
                model: Publisher
              },
              {
                model: BookDetails
              }
            ]
          },
          {
            model: Loan,
            include: [
              { model: User },
              {
                model: OwnedBook,
                include: [
                  {
                    model: Book,
                    include: [
                      {
                        model: BookDetails
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Error occurred while retrieving owned books'
        })
      })
  })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  OwnedBook.findByPk(id, {})
    .then((data) => {
      if (!data) {
        res.status(404)
      }
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving owned book with ID ' + id
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
      is_public: req.body.data.is_public
    },
    {
      where: { owned_book_id: id }
    }
  )

  OwnedBook.findByPk(id)
    .then((ownedBookData) => {
      // console.log(ownedBookData)
      Book.findByPk(ownedBookData.dataValues.book_id, {
        include: [
          {
            model: Author
          },
          {
            model: Genre
          }
        ]
      }).then((bookData) => {
        // var authors = req.body.data.additionalAuthors
        // for (var i = 0; i < authors.length; i++) {
        //   console.log('kurwa', authors[i])
        //   var newPromise = bookData.removeAuthors(
        //     authors[i].BookAuthors.author_id
        //   )
        // }
        // Promise.all(newPromise)
        deletor = {}
        toDelete = bookData.dataValues.Genres
        if (toDelete.length > 0) {
          for (var i = 0; i < toDelete.length; i++) {
            var counter = toDelete[i].dataValues.genre_id
            console.log('counter', counter)
            bookData.removeGenres(counter)
          }
        }

        return Book.findByPk(ownedBookData.dataValues.book_id, {
          include: [
            {
              model: Author
            },
            {
              model: Genre
            }
          ]
        }).then((freeFromGenres) => {
          deletor = []
          authorsToDelete = freeFromGenres.dataValues.Authors
          if (authorsToDelete.length > 0) {
            for (var i = 0; i < authorsToDelete.length; i++) {
              var counter = authorsToDelete[i].dataValues.author_id
              console.log('counter', counter)
              var deleteAuthorPromise = freeFromGenres.removeAuthors(counter)
              deletor.push(deleteAuthorPromise)
            }
          }
          return Book.findByPk(ownedBookData.dataValues.book_id, {
            include: [
              {
                model: Author
              },
              {
                model: Genre
              }
            ]
          }).then((freeFromGenresAndAuthors) => {
            console.log('freeFromGenresAndAuthors', freeFromGenresAndAuthors)
            BookDetails.update(
              {
                isbn: req.body.data.isbn,
                title: req.body.data.title,
                publication_year: req.body.data.publication_year,
                place_of_publication: req.body.data.place_of_publication,
                language_of_original: req.body.data.language_of_original,
                language: req.body.data.language
              },
              {
                where: {
                  book_details_id: bookData.dataValues.book_details_id
                }
              }
            )
            Publisher.update(
              { publisher_name: req.body.data.publisher_name },
              { where: { publisher_id: bookData.dataValues.publisher_id } }
            )
            Category.update(
              { category_name: req.body.data.category_name },
              { where: { category_id: bookData.dataValues.category_id } }
            )

            var genres = req.body.data.additionalGenres
            genreData = []
            console.log('JANRA')

            for (var g = 0; g < genres.length; g++) {
              console.log('gname', genres[g].genre_name)
              var newGenresPromise = Genre.findOrCreate({
                where: {
                  genre_name: genres[g].genre_name
                },
                defaults: {
                  genre_name: genres[g].genre_name
                }
              })
              genreData.push(newGenresPromise)
            }
            return Promise.all(genreData).then((genreData) => {
              // console.log('jenre', genreData)
              if (!genreData) {
                throw new Error('Genre details error')
              }

              if (genreData[0]) {
                console.log('GENREDATA', genreData.length)
                newGenreData = genreData
                for (var h = 0; h < genreData.length; h++) {
                  // var currA = authorData[0]
                  // var newGenreData = genreData[0]
                  var currG = newGenreData[h]
                  // console.log('CURRA', currG)
                  freeFromGenresAndAuthors.addGenre(currG[0])
                  // console.log('PROMYS2', )
                }
                // console.log('Genre from Genre Model', genreData[0])
                // bookData[0].addGenre(genreData[0])
                // .then(() => console.log('GENRE', bookData))
              }
              var authors = req.body.data.additionalAuthors
              authorData = []
              for (var i = 0; i < authors.length; i++) {
                var newPromise = Author.findOrCreate({
                  where: {
                    [Op.and]: [
                      { author_name: authors[i].author_name },
                      { author_surname: authors[i].author_surname }
                    ]
                  },
                  defaults: {
                    author_name: authors[i].author_name,
                    author_surname: authors[i].author_surname
                  }
                })
                authorData.push(newPromise)
              }
              return (
                Promise.all(authorData)
                  // Author.bulkCreate(req.body.data.additionalAuthors)
                  .then((authorData) => {
                    if (!authorData) {
                      throw new Error('Author details error')
                    }

                    if (authorData[0]) {
                      console.log('AUTHORDATA')
                      newAuthorData = authorData

                      // console.log(
                      //   'Author from Author Model',
                      //   authorData[0]
                      // )
                      for (var j = 0; j < authorData.length; j++) {
                        var currA = newAuthorData[j]
                        freeFromGenresAndAuthors.addAuthor(currA[0])

                        // console.log('laala', authorData[j].length)
                        // var currA = authorData[j]
                        // console.log('CURRA', currA[0])
                        // bookData[0].addAuthor(currA[0])
                        // console.log('PROMYS2', )
                      }
                    }
                    // console.log('TESTAUTHORS', authorData)

                    // BookAuthors.destroy({ where: book_id == req.body.data.book_id })

                    // var authors = req.body.data.additionalAuthors
                    // authorData = []
                    // for (var i = 0; i < authors.length; i++) {
                    //   var newPromise = Author.findOrCreate({
                    //     where: {
                    //       [Op.and]: [
                    //         { author_name: authors[i].author_name },
                    //         { author_surname: authors[i].author_surname }
                    //       ]
                    //     },
                    //     defaults: {
                    //       author_name: authors[i].author_name,
                    //       author_surname: authors[i].author_surname
                    //     }
                    //   })
                    //   authorData.push(newPromise)
                    // }
                    // return (
                    //   Promise.all(authorData)
                    //     // Author.bulkCreate(req.body.data.additionalAuthors)
                    //     .then((authorData) => {
                    //       if (!authorData) {
                    //         bookData.set
                    //         throw new Error('Author details error')
                    //       }
                    //     })
                    // )

                    // var authors = req.body.data.additionalAuthors
                    // authorData = []
                    // for (var i = 0; i < authors.length; i++) {
                    //   console.log('authori', authors[i])
                    //   var newAuthorsPromise = Author.findOne({
                    //     where: {
                    //       [Op.and]: [
                    //         { author_name: authors[i].author_name },
                    //         { author_surname: authors[i].author_surname }
                    //       ]
                    //     }
                    //   })
                    //   // console.log('NEWMETHODupdate', newAuthorsPromise)

                    //   if (!newAuthorsPromise) {
                    //     console.log('noowo', authors[i])
                    //     newAuthorsPromise = Author.create(
                    //       { author_name: authors[i].author_name },
                    //       { author_surname: authors[i].author_surname }
                    //     ).then((newestAuthorsPromise) =>
                    //       authorData.push(newestAuthorsPromise)
                    //     )
                    //   }

                    // newAuthorsPromise
                    //   .update(
                    //     { author_name: authors[i].author_name },
                    //     { author_surname: authors[i].author_surname }
                    //   )
                    //   .then((newestAuthorsPromise) =>
                    //     authorData.push(newestAuthorsPromise)
                    //   )
                    // }

                    // return (
                    //   Promise.all(authorData)
                    //     // Author.bulkCreate(req.body.data.additionalAuthors)
                    //     .then((authorData) => {
                    //       if (!authorData) {
                    //         throw new Error('Author details error')
                    //       }
                    //     })
                    // )

                    // Author.update(
                    //   {
                    //     author_name: req.body.data.author_name,
                    //     author_surname: req.body.data.author_surname
                    //   },
                    //   { where: { author_id: bookData.dataValues.author_id } }
                    // )

                    // console.log('CHECKME', bookData)
                    // Author.bulkCreate(req.body.data.additionalAuthors).then(
                    // (authorData) => {
                    //   if (!authorData) {
                    //     // console.log('Author details error')
                    //   }
                    // authorObject = {
                    //   author_name: authorData.author_name,
                    //   author_surname: authorData.author_surname
                    // }
                    // bookData.setAuthors(authorData)
                    // console.log('DEJTA', bookData)

                    // Genre.update(
                    //   { genre_name: req.body.data.genre_name },
                    //   { where: { genre_id: bookData.dataValues.genre_id } }
                    // )

                    // Genre.bulkCreate(req.body.data.additionalGenres).then(
                    //   (genreData) => {
                    //     if (!genreData) {
                    //       // console.log('genreData details error')
                    //     }
                    //     // console.log('jenre', genreData)
                    //     // authorObject = {
                    //     //   author_name: authorData.author_name,
                    //     //   author_surname: authorData.author_surname
                    //     // }
                    //     bookData.setGenres(genreData)
                    //   }
                    // )
                  })
              )
            })
          })
        })
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
    where: { owned_book_id: id }
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Owned book with id ' + id + ' was deleted successfully'
        })
      } else {
        res.send({
          message: 'Cannot delete owned book with id ' + id
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error deleting owned book with id ' + id
      })
    })
}

exports.addAuthorToBook = (req, res) => {
  console.log('PROTO', Book.prototype)

  Author.findOrCreate({
    where: {
      [Op.and]: [
        { author_name: req.body.data.additional_author_name },
        { author_surname: req.body.data.additional_author_name }
      ]
    },
    defaults: {
      author_name: req.body.data.additional_author_name,
      author_surname: req.body.data.additional_author_surname
    }
  })
    .then((authorData) => {
      Book.findOne({
        where: {
          book_id: req.body.data.book_id
        }
      }).then((bookData) => {
        // console.log(bookData)
        bookData.addAuthor(authorData[0])
        // .then(() => console.log('NEW ADDITIONAL AUTHOR', bookData))
        res.send(bookData)
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while adding an author'
      })
    })
}

exports.addGenreToBook = (req, res) => {
  Genre.findOrCreate({
    where: {
      genre_name: req.body.data
    },
    defaults: {
      genre_name: req.body.data
    }
  })
    .then((genreData) => {
      Book.findOne({
        where: {
          book_id: req.params.id
        }
      }).then((bookData) => {
        // console.log('CHECKMEHERE', genreData[0])
        bookData.addGenre(genreData[0])
        // .then(() => console.log('ADDITIONAL GENRE', bookData))
        res.send(bookData)
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while adding a genre'
      })
    })
}

exports.getPublicLib = (req, res) =>
  OwnedBook.findAll({
    where: { is_public: true },
    include: [
      { model: User },

      {
        model: Book,
        include: [
          {
            model: Author
          },
          { model: BookDetails }
        ]
      }
    ]
  }).then((publicLib) => {
    // console.log('PUBLICLIB', publicLib)
    res.send(publicLib)
  })
