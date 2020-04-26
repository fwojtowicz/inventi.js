module.exports = (sequelize, Sequelize) => {
  const Publisher = sequelize.define("Publisher", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    publisher_name: {
      type: Sequelize.STRING,
    },
  })
  return Publisher
}
