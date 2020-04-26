module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("Book", {
    book_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    author_id: {
      type: Sequelize.INTEGER,
    },
    publisher_id: {
      type: Sequelize.INTEGER,
    },
    genre_id: {
      type: Sequelize.INTEGER,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    book_details_id: {
      type: Sequelize.INTEGER,
    },
  })
  return Book
}
