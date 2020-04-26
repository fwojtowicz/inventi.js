module.exports = (sequelize, Sequelize) => {
  const Loan = sequelize.define("Loan", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.STRING,
    },
    owned_book_id: {
      type: Sequelize.STRING,
    },
    when_loaned: {
      type: Sequelize.DATE,
    },
    when_returned: {
      type: Sequelize.DATE,
    },
  })
  return Loan
}
