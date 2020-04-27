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
db.author = require("./authorModel")(sequelize, Sequelize)
db.bookDetails = require("./bookDetailsModel")(sequelize, Sequelize)
db.category = require("./categoryModel")(sequelize, Sequelize)
db.genre = require("./genreModel")(sequelize, Sequelize)
db.loan = require("./loanModel")(sequelize, Sequelize)
db.ownedBook = require("./ownedBookModel")(sequelize, Sequelize)
db.publisher = require("./publisherModel")(sequelize, Sequelize)

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

db.user.hasMany(db.ownedBook, { foreignKey: "user_id", targetKey: "user_id" })
db.user.hasMany(db.loan, { foreignKey: "user_id", targetKey: "user_id" })
db.ownedBook.hasMany(db.loan, {
  foreignKey: "owned_book_id",
  targetKey: "owned_book_id",
})
db.book.hasMany(db.ownedBook, { foreignKey: "book_id", targetKey: "book_id" })

db.book.belongsToMany(db.author, {
  through: "BookAuthors",
  foreignKey: "book_id",
  otherKey: "author_id",
})

db.author.belongsToMany(db.book, {
  through: "BookAuthors",
  foreignKey: "author_id",
  otherKey: "book_id",
})

db.book.belongsToMany(db.genre, {
  through: "BookGenres",
  foreignKey: "book_id",
  otherKey: "genre_id",
})

db.genre.belongsToMany(db.book, {
  through: "BookGenres",
  foreignKey: "genre_id",
  otherKey: "book_id",
})

db.category.hasMany(db.book, {
  foreignKey: "category_id",
  targetKey: "category_id",
})

db.bookDetails.hasOne(db.book, {
  foreignKey: "book_details_id",
})
db.book.belongsTo(db.bookDetails, {
  foreignKey: "book_details_id",
})

db.publisher.hasMany(db.books, {
  foreignKey: "publisher_id",
  targetKey: "publisher_id",
})

// db.user.hasMany(db.loan, { foreignKey: "id" })
// db.loan.hasMany(db.ownedBook, { foreignKey: "id" })

db.ROLES = ["user", "admin"]

module.exports = db
