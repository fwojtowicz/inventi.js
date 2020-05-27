const Mailer = require('../controllers/mailerController')
var router = require('express').Router()

router.post('/sendmail', Mailer.sendReminder)
router.post('/sendloanrequest', Mailer.sendLoanRequest)

// router.delete('/', Books.deleteAll)
module.exports = router
