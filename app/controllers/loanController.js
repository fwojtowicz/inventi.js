const db = require('../models')
const OwnedBook = db.ownedBook
const User = db.user
const Loan = db.loan
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  OwnedBook.findByPk(req.body.data.owned_book_id)
    .then((ownedBookData) => {
      User.findByPk(req.body.data.user_id)
        .then((userData) => {
          Loan.findOrCreate({
            where: {
              [Op.and]: [
                { user_id: userData.user_id },
                { owned_book_id: ownedBookData.owned_book_id }
              ]
            },
            defaults: {
              when_loaned: req.body.data.when_loaned,
              when_returned: req.body.data.when_returned
            }
          })
            .then((loan) => {
              console.log(Loan.prototype)
              loan[0].setUser(userData)
              loan[0].setOwnedBook(ownedBookData)
              res.send(loan)
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || 'Error with loan '
              })
            })
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Error with owned book  '
          })
        })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error with user '
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id
  console.log('ID', id)

  Loan.findByPk(id, { include: [{ model: User }, { model: OwnedBook }] })
    .then((data) => {
      if (!data) {
        res.status(404)
      }
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving loan with ID ' + id
      })
    })
}

exports.findAll = (req, res) => {
  const userID = req.user_id

  User.findByPk(userID).then((userData) => {
    userData
      .getLoans({})
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Error occurred while retrieving user loans'
        })
      })
  })
  // Loan.findAll()
  //   .then((data) => {
  //     res.send(data)
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || 'Error occurred while retrieving loans',
  //     })
  //     // })
  //   })
}

exports.delete = (req, res) => {
  const id = req.params.id
  Loan.destroy({
    where: { loan_id: id }
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Loan with id ' + id + ' was deleted successfully'
        })
      } else {
        res.send({
          message: 'Cannot delete loan with id ' + id
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error deleting loan with id ' + id
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id
  OwnedBook.findByPk(req.body.data.owned_book_id).then((ownedBookData) => {
    User.findByPk(req.body.data.user_id).then((userData) => {
      Loan.update(
        {
          when_loaned: req.body.data.when_loaned,
          when_returned: req.body.data.when_returned
        },
        {
          where: { owned_book_id: id }
        }
      )

      Loan.findByPk(id)
        .then((loan) => {
          console.log(Loan.prototype)
          loan[0].setUser(userData)
          loan[0].setOwnedBook(ownedBookData)
          res.send(loan)
        })
        .catch((err) => {
          res.status(500).send({
            message: 'Error with Loan'
          })
        })
    })
  })
}
