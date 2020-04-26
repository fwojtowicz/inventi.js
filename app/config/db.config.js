module.exports = {
  HOST: "localhost",
  USER: "eureka",
  PASSWORD: "eureka",
  DB: "eureka_development",
  dialect: "postgres",
  underscored: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
