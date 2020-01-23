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
router.get('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const { exerciseId } = req.params;
  // get populated comments from exercise id
  try {
    const exercise = await Exercise.findById(exerciseId).populate({path: 'comments', model: 'Comment', populate: {path: 'author', model: 'User', select: 'name lastName'}});
    res.status(200).json(exercise.comments);
  }
  catch(error) {
    next(error);
  }
})

// DELETE /comments/:commentId
router.delete('/:exerciseId/:commentId', isLoggedIn, async (req, res, next) => {
  const { exerciseId, commentId } = req.params;

  try {
    // delete comment from comments array of exercise
    const exercise = await Exercise.findById(exerciseId);
    // get position of comment in comments array
    const indexOfComment = exercise.comments.indexOf(commentId);
    // delete comment from array
    exercise.comments.splice(indexOfComment, 1);
    // update exercise
    const updatedExercise = await Exercise.findByIdAndUpdate(exerciseId, {comments: exercise.comments}, {new: true});
    
    // delete comment form comments collection
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json(updatedExercise);
  }
  catch(error) {
    next(error);
  }
})

// PUT /comments/:commentId


module.exports = router;