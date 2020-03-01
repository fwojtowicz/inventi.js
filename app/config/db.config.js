module.exports = {
  HOST: "localhost",
  USER: "erato",
  PASSWORD: "erato",
  DB: "erato_development",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
