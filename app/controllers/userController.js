const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Op = db.Sequelize.Op

exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving users'
      })
    })
}
