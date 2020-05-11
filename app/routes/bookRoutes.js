const Books = require('../controllers/bookController')
var router = require('express').Router()

const { authJWT } = require('../middlewares')

const authCheck = (req, res, next) => {
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
    console.log('USERID')
  } else {
    req.body.data.user_id = req.user.dataValues.user_id
    next()
  }
}
router.post('/', Books.create)

router.get('/', authCheck, Books.findAll)

router.get('/:id', Books.findOne)

router.patch('/:id', Books.update)

router.delete('/:id', Books.delete)

// router.delete('/', Books.deleteAll)
module.exports = router
