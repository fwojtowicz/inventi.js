const BooksDetail = require('../controllers/bookDetailsController')
var router = require('express').Router()

router.post('/', BooksDetail.create)

router.get('/', BooksDetail.findAll)

router.get('/:id', BooksDetail.findOne)

router.patch('/:id', BooksDetail.update)

router.delete('/:id', BooksDetail.delete)

router.delete('/', BooksDetail.deleteAll)
module.exports = router
