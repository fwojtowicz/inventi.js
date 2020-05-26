module.exports = (sequelize, Sequelize) => {
  const OwnedBook = sequelize.define('OwnedBook', {
    owned_book_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    book_id: {
      type: Sequelize.INTEGER
    },
    when_bought: {
      type: Sequelize.DATEONLY
    },
    owned_book_price: {
      type: Sequelize.DECIMAL
    },
    was_a_gift: {
      type: Sequelize.BOOLEAN
    },
    comment: {
      type: Sequelize.STRING
    },
    isPublic: {
      type: Sequelize.BOOLEAN
    }
  })
  return OwnedBook
}
