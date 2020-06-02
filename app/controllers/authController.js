const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role

const Op = db.Sequelize.Op

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.roles
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message: 'User registered successfully [roles provided]'
            })
          })
        })
      } else {
        console.log('PROBLEM', User.prototype)
        user.setRoles([1]).then((problem) => {
          res.send({ message: 'User registered successfully' })
        })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
}

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }
      var passwordValid = bcrypt.compareSync(req.body.password, user.password)
      if (!passwordValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid password'
        })
      }

      var token = jwt.sign({ id: user.dataValues.user_id }, config.secret, {
        expiresIn: 86400
      })

      var authorities = []
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name)
        }
        res.status(200).send({
          newUser: [
            {
              user_id: user.dataValues.user_id,
              username: user.username,
              email: user.email,
              roles: authorities
            }
          ],
          accessToken: token
        })
      })
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
}
