const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');
const Exercise = require('../models/Exercise');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

// POST /comments/:exerciseId
router.post('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params; // exercise id
  const author = req.session.currentUser._id;
  const {text} = req.body;

  // add comment to db + to comments array of exercise
  try {
    
    // add exercise to db
    const comment = await Comment.create({text, author});
    
    // find exercise
    const exercise = await Exercise.findById(exerciseId);
    
    // push comment
    exercise.comments.push(comment._id);
    
    // update exercise comments in db
    const updatedExercise = await Exercise.findByIdAndUpdate(exerciseId, {comments: exercise.comments}, {new: true}).populate({path: 'comments', model: 'Comment', populate: {path: 'author', model: 'User', select: 'name lastName'}});
    
    // only return the comments array
    res.status(200).json(updatedExercise.comments)
  }
  catch(error) {
    next(error);
  }
})

// GET /comments/:exerciseId
router.get('/:id', isLoggedIn, async (req, res, next) => {
  const id = req.params;
  console.log(id);

  // get populated comments

})

// DELETE /comments/:commentId


// PUT /comments/:commentId


module.exports = router;