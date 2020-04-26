const dbConfig = require("../config/db.config.js")
const Sequelize = require("sequelize")

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    port: 5432,
    host: "<heroku host>",
    logging: true,
  })
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  })
}

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.book = require("./bookModel.js")(sequelize, Sequelize)
db.user = require("./userModel.js")(sequelize, Sequelize)
db.role = require("./roleModel")(sequelize, Sequelize)
db.role = require("./authorModel")(sequelize, Sequelize)
db.role = require("./bookDetailsModel")(sequelize, Sequelize)
db.role = require("./categoryModel")(sequelize, Sequelize)
db.role = require("./genreModel")(sequelize, Sequelize)
db.role = require("./loanModel")(sequelize, Sequelize)
db.role = require("./ownedBookModel")(sequelize, Sequelize)
db.role = require("./publisherModel")(sequelize, Sequelize)

db.role.belongsToMany(db.user, {
  through: "UserRoles",
  foreignKey: "roleID",
  otherKey: "userID",
})

db.user.belongsToMany(db.role, {
  through: "UserRoles",
  foreignKey: "userID",
  otherKey: "roleID",
})

db.ROLES = ["user", "admin"]

module.exports = db
