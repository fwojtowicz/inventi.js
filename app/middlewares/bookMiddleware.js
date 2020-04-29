const db = require('../models')
const ROLES = db.ROLES
const Author = db.author

checkDuplicates = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.author_name,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Username already in use',
      })
      return
    }
  })
  next()
}
