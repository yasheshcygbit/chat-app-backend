const express = require("express");
const router = express.Router();
const users = require('./users');
const movies = require('./movies');

// public route
router.use('/users', users);

// private route
router.use('/movies', movies);

module.exports = router;
