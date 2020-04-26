module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    category_name: {
      type: Sequelize.STRING,
    },
  })
  return Category
}
