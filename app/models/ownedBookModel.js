module.exports = (sequelize, Sequelize) => {
  const OwnedBook = sequelize.define("OwnedBook", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.STRING,
    },
    book_id: {
      type: Sequelize.STRING,
    },
    when_bought: {
      type: Sequelize.DATE,
    },
    owned_book_price: {
      type: Sequelize.DECIMAL,
    },
    was_a_gift: {
      type: Sequelize.BOOLEAN,
    },
    comment: {
      type: Sequelize.STRING,
    },
  })
  return OwnedBook
}
