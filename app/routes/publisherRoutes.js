const publishers = require('../controllers/publisherController')
var router = require('express').Router()
router.post('/', publishers.create)
router.patch('/:id', publishers.update)
// router.get('/:id', authors.findOne)

// app.use("/api/authors", router)

module.exports = router
