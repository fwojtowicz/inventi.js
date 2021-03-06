module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define('Book', {
    book_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    publisher_id: {
      type: Sequelize.INTEGER
    },

    category_id: {
      type: Sequelize.INTEGER
    },

    is_public: {
      type: Sequelize.BOOLEAN
    },

    isbn: {
      type: Sequelize.STRING,
      unique: { msg: 'ISBN already exists' },
      allowNull: false,
      validate: {
        notNull: { msg: 'ISBN is required' },
        isNumeric: { msg: 'ISBN is not numerical' },
        len: {
          args: [10, 13],
          msg:
            'ISBN must be between 10 (ISBN-10) to 13 (ISBN-13) numerical characters long'
        }
      }
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Title is required' }
      }
    },
    language: {
      type: Sequelize.STRING
    },
    language_of_original: {
      type: Sequelize.STRING
    },
    place_of_publication: {
      type: Sequelize.STRING
    },
    publication_year: {
      type: Sequelize.STRING
    }
  })
  return Book
}
