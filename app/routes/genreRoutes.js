const genres = require('../controllers/genreController')
var router = require('express').Router()
router.post('/', genres.create)
router.patch('/:id', genres.update)
// router.get('/:id', authors.findOne)

// app.use("/api/authors", router)

module.exports = router
