const loans = require('../controllers/loanController')
var router = require('express').Router()

router.post('/', loans.create)

router.get('/', loans.findAll)

router.get('/:id', loans.findOne)

router.patch('/:id', loans.update)

router.delete('/:id', loans.delete)

// router.delete('/', Books.deleteAll)
module.exports = router
