const Mailer = require('../controllers/mailerController')
var router = require('express').Router()

router.post('/sendmail', Mailer.sendReminder)

// router.delete('/', Books.deleteAll)
module.exports = router
