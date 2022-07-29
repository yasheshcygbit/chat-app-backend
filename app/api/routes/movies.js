const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movies');
const { authMiddleware } = require("../middlewares/authentication");

router.use(authMiddleware)
router.get('/', movieController.getAll);
router.post('/', movieController.create);
router.get('/:movieId', movieController.getById);
router.put('/:movieId', movieController.updateById);
router.delete('/:movieId', movieController.deleteById);

module.exports = router;
