const db = require('../models')
const config = require('../config/auth.config')
const Publisher = db.publisher
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.data.publisher_name) {
    res.status(400).send({
      message: 'Genre name is needed',
    })
    return
  }

  const publisher_name = {
    publisher_name: req.body.data.publisher_name,
  }

  Publisher.findOrCreate({
    where: {
      publisher_name: req.body.data.publisher_name,
    },
    defaults: {
      publisher_name: req.body.data.publisher_name,
    },
  })
    .then((data) => {
      res.send(data)
      console.log('SERVER HERE')
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occured while creating a genre',
      })
    })
}

// exports.findOne = (req, res) => {
//   const id = req.params.id

//   Author.findByPk(id)
//     .then((data) => {
//       if (!data.body) res.status(404)
//       res.send(data)
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Error retrieving author with ID' + id,
//       })
//     })
// }

exports.update = (req, res) => {
  const id = req.params.id
  Publisher.update(req.body.data, {
    where: { publisher_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Category was updated successfully',
        })
      } else {
        res.send({
          message: 'Cannot update category with id ' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating category with id ' + id,
      })
    })
}
