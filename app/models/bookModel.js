module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("Book", {
    isbn: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    author: {
      type: Sequelize.STRING,
    },
    publisher: {
      type: Sequelize.STRING,
    },
    publication_year: {
      type: Sequelize.STRING,
    },
    place_of_publication: {
      type: Sequelize.STRING,
    },
    genre: {
      type: Sequelize.STRING,
    },
    language_of_original: {
      type: Sequelize.STRING,
    },
    language: {
      type: Sequelize.STRING,
    },
    whoLend: {
      type: Sequelize.STRING,
    },
    whoBorrowed: {
      type: Sequelize.STRING,
    },
    isRequested: {
      type: Sequelize.BOOLEAN,
    }
  })
  return Book

}
