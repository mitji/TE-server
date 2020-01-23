const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const authRouter = require('./auth');

router.use('/auth', authRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200);
});

module.exports = router;