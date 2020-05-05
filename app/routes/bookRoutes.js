const Books = require('../controllers/bookController')
var router = require('express').Router()

router.post('/', Books.create)

router.get('/', Books.findAll)

router.get('/:id', Books.findOne)

router.patch('/:id', Books.update)

router.delete('/:id', Books.delete)

// router.delete('/', Books.deleteAll)
module.exports = router
