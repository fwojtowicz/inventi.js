module.exports = (sequelize, Sequelize) => {
  const BookDetails = sequelize.define("BookDetails", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    isbn: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    language: {
      type: Sequelize.STRING,
    },
    language_of_original: {
      type: Sequelize.STRING,
    },
    place_of_publication: {
      type: Sequelize.STRING,
    },
    publication_year: {
      type: Sequelize.STRING,
    },
  })
  return BookDetails
}
