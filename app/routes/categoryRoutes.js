const categories = require('../controllers/categoryController')
var router = require('express').Router()
router.post('/', categories.create)
router.patch('/:id', categories.update)
// router.get('/:id', authors.findOne)

// app.use("/api/authors", router)

module.exports = router
