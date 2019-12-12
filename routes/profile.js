const express = require('express');
const router = express.Router();

const User = require('../models/User');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

// GET /profile - all user info
router.get('/', isLoggedIn, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const user = await User.findById(userId).populate({path: 'exercises savedExercises', model: 'Exercise', populate: {path: 'author', model: 'User', select: 'name lastName'}}); 
    res.json(user);
  }
  catch(error) {
    next(error)
  }
});

// PUT /profile/:exerciseId - unsave exercise from 'saved exercise'
// delete copy from database
// delete id from user's saved_exercises array

module.exports = router;