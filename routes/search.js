const express = require('express');
const router = express.Router();

const Exercise = require('../models/Exercise');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

// GET /search?search=sometext
router.get('/', isLoggedIn, async (req, res, next) => {
  // return exercises where the title matches the search
  const { search } = req.query;
  try {
    const foundExs = await Exercise.find().and([{ title: { $regex: search, $options: "i" } }, {share: 'true'}])
    res.json(foundExs);
  }
  catch(error) {
    next(error);
  }
});

module.exports = router;