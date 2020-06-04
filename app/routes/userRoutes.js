const users = require('../controllers/userController')
var router = require('express').Router()

router.get('/', users.findAll)

module.exports = router
