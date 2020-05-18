const users = require('../controllers/userController')
var router = require('express').Router()

router.get('/', users.findAll)

// router.delete('/', Books.deleteAll)
module.exports = router
