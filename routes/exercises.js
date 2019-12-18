const express = require('express');
const router = express.Router();

const parser = require('./../config/cloudinary');

const User = require('../models/User');
const Exercise = require('../models/Exercise');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

// GET /exercises
router.get('/', isLoggedIn, (req, res, next) => {
  res.json({message: 'in /exercises'});
});

// GET /exercises/new
router.get('/new', isLoggedIn, (req, res, next) => {
  res.json({message: 'in /exercises/add'});
});

// POST /exercises/new
router.post('/new', isLoggedIn, async (req, res, next) => {
  const {title, description, duration, sport, type, video_url, img_url, share} = req.body;
  const userId = req.session.currentUser._id;
 
  try {
    // add exercise to db
    const newExercise = await Exercise.create({title, description, duration, sport, type, video_url, img_url, share, author: userId});
    
    // add exercise to user exercises array
    User.findById(userId)
      .then((user) => {
        user.exercises.push(newExercise);
        console.log('\n\nuser exercises ---->\n',user.exercises);
        User.findByIdAndUpdate(userId, {exercises: user.exercises}, {new: true}).populate('exercises')
          .then( (updatedUser) => {
            res.status(201).json(updatedUser); // updated array of exercises for the FE
          })
          .catch(err => console.log(err));
      })
  } catch(error) {
    next(error);
  }
});

// POST /exercise/new/image - upload exercise image
router.post('/new/image', parser.single('photo'), (req, res, next) => {
  console.log('file uploaded');
  if (!req.file) {
    next(new Error('No file uploaded!'));
  };
  const imageUrl = req.file.secure_url;
  res.json(imageUrl).status(200);
});

// GET /exercises/:exerciseId - GO TO A SPECIFIC exercise
router.get('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params;
  try {
    const exercise = await Exercise.findOne({_id:exerciseId});
    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  } 
});

// GET /:exerciseId/edit - 'edit exercise' view

// PUT /exercises/:exerciseId- update exercise
router.put('/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {title, description, duration, sport, type, video_url, img_url, share} = req.body;
  const {exerciseId} = req.params;
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate({_id: exerciseId},{title, description, duration, sport, type, video_url, img_url, share}, {new: true});
    res.status(200).json(updatedExercise);  // 200 OK
  } catch (error) {
    next(error);
  }
});

// DELETE /exercises/:exerciseId - delete exercise
router.delete('/:exerciseId',isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params;
  const userId = req.session.currentUser._id;
  try {
    // delete exercise from database
    await Exercise.findByIdAndDelete(exerciseId);

    // delete exercise from user exercises array
    User.findById(userId)
      .then( (user) => {
        var index = user.exercises.indexOf(exerciseId);
        user.exercises.splice(index, 1);
        User.findByIdAndUpdate(userId, {exercises: user.exercises}, {new:true}).populate('exercises')
          .then( (updatedUser) => {
            res.status(200).json(updatedUser);  // 200 OK
          })
          .catch(err => console.log(err));
      })   
  } catch (error) {
    next(error);
  }
});


module.exports = router;