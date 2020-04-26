module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define("Author", {
    author_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    author_name: {
      type: Sequelize.STRING,
    },

    author_surname: {
      type: Sequelize.STRING,
    },
  })
  return Author
}
