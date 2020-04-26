module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("Book", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    author_id: {
      type: Sequelize.STRING,
    },
    publisher_id: {
      type: Sequelize.STRING,
    },
    genre_id: {
      type: Sequelize.STRING,
    },
    category_id: {
      type: Sequelize.STRING,
    },
    book_details_id: {
      type: Sequelize.STRING,
    },
  })
  return Book
}
