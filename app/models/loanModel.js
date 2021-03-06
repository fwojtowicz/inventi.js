module.exports = (sequelize, Sequelize) => {
  const Loan = sequelize.define('Loan', {
    loan_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    owned_book_id: {
      type: Sequelize.INTEGER
    },
    when_loaned: {
      type: Sequelize.DATEONLY
    },
    when_returned: {
      type: Sequelize.DATEONLY
    }
  })
  return Loan
}
