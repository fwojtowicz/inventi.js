const Books = require('../controllers/bookController')
var router = require('express').Router()

const { authJWT } = require('../middlewares')

const authCheck = (req, res, next) => {
  if (!req.user) {
    authJWT.verifyToken(req, res, next)
  } else {
    req.body.data.user_id = req.user.dataValues.user_id
    next()
  }
}
router.post('/', authCheck, Books.create)

router.get('/', authCheck, Books.findAll)

router.get('/public', Books.getPublicLib)

router.get('/:id', authCheck, Books.findOne)

router.patch('/:id', authCheck, Books.update)

router.delete('/:id', authCheck, Books.delete)

module.exports = router
