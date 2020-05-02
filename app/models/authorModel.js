module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define('Author', {
    author_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    author_name: {
      type: Sequelize.STRING,
      unique: 'uniqueNameSurname',
    },

    author_surname: {
      type: Sequelize.STRING,
      unique: 'uniqueNameSurname',
    },
  })
  return Author
}
