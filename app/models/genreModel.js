module.exports = (sequelize, Sequelize) => {
  const Genre = sequelize.define("Genre", {
    genre_id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    genre_name: {
      type: Sequelize.STRING,
    },
  })
  return Genre
}
