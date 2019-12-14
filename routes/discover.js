const express = require('express');
const router = express.Router();
const queryString = require('query-string');

const Exercise = require('../models/Exercise');
const User = require('../models/User');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

// GET /discover/:exerciseId - exercise details
router.get('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params;
  try {
    const exercise = await Exercise.findById(exerciseId).populate('author', 'name lastName');
    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  } 
});

// PUT /discover/:exerciseId - save exercise
router.put('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params;
  const userId = req.session.currentUser._id;
  try {
    const user = await User.findById(userId);
    user.savedExercises.push(exerciseId);
    const updatedUser = await User.findByIdAndUpdate(userId, {savedExercises: user.savedExercises}, {new: true});
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  } 
});

// GET /discover - show all exercises
router.get('/', isLoggedIn, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  
  //  SET FILTER //
  const { sport, type } = req.query;
  let filter = {};

  if(sport!='all' && type==='all') {
    filter = {sport: sport};
  } else if (sport==='all'&& type!='all') {
    filter = {type: type};
  } else if (typeof sport!='all' && type!='all') {
    filter = {sport: sport, type: type};
  }
  // FILTER //

  try {
    const allExercises = await Exercise.find({share: true, author: {$ne: userId}}).populate('author', 'name lastName'); // populate author but get only name and lastName (+ id by default)
    res.status(200).json(allExercises);
  }
  catch(user) {
    next(user);
  }
});

module.exports = router;