const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Training = require('../models/Training');

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
    const user = await User.findById(userId).populate({path: 'exercises savedExercises trainings', 
                                                      populate: [ {path: 'author', model: 'User', select: 'name lastName'},
                                                                  {path: 'exercises', model: 'Exercise'}]
                                                      }); 
    res.status(200).json(user);
  }
  catch(error) {
    next(error)
  }
});

// PUT /profile/:exerciseId - unsave exercise from 'saved exercise'
// --> delete id from user's saved_exercises array
router.put('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params;
  const userId = req.session.currentUser._id;
  try {
    // get user saved exercises
    const user = await User.findById(userId);
    
    // delete the selected exercise
    var index = user.savedExercises.indexOf(exerciseId);
    user.savedExercises.splice(index,1);

    // update user saved exercises
    const updatedUser = await User.findByIdAndUpdate(userId, {savedExercises: user.savedExercises}, {new:true}).populate('savedExercises')
    res.status(200).json(updatedUser);  // 200 OK
  }
  catch(error) {
    next(error);
  }

})


module.exports = router;