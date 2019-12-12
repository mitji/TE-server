const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Training = require('../models/Training')

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');


// GET /my-trainings/new
router.get('/new', isLoggedIn, (req, res, next) => {
  res.status(200).json({message: "let's add a new training!"});
});

// POST /my-trainings/new
router.post('/new', isLoggedIn, async (req, res, next) => {
  
  const { title, description, duration, sport, type, exercises } = req.body;
  const userId = req.session.currentUser._id;
  
  try {
    // add training to trainings collection
    const newTraining = await Training.create({ title, description, duration, sport, type, exercises, author: userId});
    console.log('\n\n NEW TRAINING --- ', newTraining);
    
    // add training to user trainings array
    User.findById(userId)
    .then((user) => {
      user.trainings.push(newTraining);
      User.findByIdAndUpdate({_id: userId}, {trainings: user.trainings}, {new: true}).populate('trainings')
      .then( (updatedUser) => {
        res.status(201).json(updatedUser.trainings);
      })
      .catch(err => console.log(err));
    })
  } catch(error) {
    next(error);
  }
});

// GET /my-trainings/:trainingId - GO TO A SPECIFIC TRAINING
router.get('/:trainingId', isLoggedIn, async (req, res, next) => {
  const {trainingId} = req.params;
  
  try {
    const training = await Training.findById(trainingId).populate('exercises');
    console.log('\n\n TRAINING --- ', training);
    res.status(200).json(training);
  } catch(error) {
    next(error);
  }
  
});

// GET /my-trainings/:trainingId/edit - 'edit training' view


// PUT /my-trainings/:trainingId - update training
router.put('/:trainingId', isLoggedIn, async (req, res, next) => {
  const { title, description, duration, sport, type } = req.body;
  const {trainingId} = req.params;
  try {
    const updatedTraining = await Training.findByIdAndUpdate({_id: trainingId}, { title, description, duration, sport, type }, {new: true}).populate('exercises');
    console.log('\n\n UPDATED TRAINING --- ', updatedTraining);
    // find all trainings and send those?
    res.status(200).json(updatedTraining);
  } catch(error) {
    next(error);
  }
});

// DELETE /my-trainings/:trainingId/edit - delete training
router.delete('/:trainingId',isLoggedIn, async (req, res, next) => {
  const {trainingId} = req.params;
  const userId = req.session.currentUser._id;
  try {
    // delete training from database
    await Training.findByIdAndDelete(trainingId);
    // delete exercise from user exercises array
    User.findById(userId)
    .then( (user) => {
      var index = user.trainings.indexOf(trainingId);
      user.trainings.splice(index, 1);
      User.findByIdAndUpdate({_id: userId}, {trainings: user.trainings}, {new: true}).populate('trainings')
      .then( (user) => {
        res.status(200).json(user);  // 200 OK
      })
      .catch(err => console.log(err));
    })    
  } catch (error) {
    next(error);
  }
});

// POST /my-trainings/:trainingId/:exerciseId - add exercise to training
// create copy of the exercise and add it to the training
// --> used for an exercise from the user and for a saved exercise
router.post('/:trainingId/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {trainingId, exerciseId} = req.params;
  
  try {
    // find exercise
    const exercise = await Exercise.findById(exerciseId);
    console.log('exercise ------->', exercise);
    // create copy of exercise in Exercises collection
    const exerciseCopy = await Exercise.create({title: exercise.title, 
      description: exercise.description, 
      duration: exercise.duration, 
      sport: exercise.sport, 
      type: exercise.type, 
      video_url: exercise.video_url, 
      img_url: exercise.img_url, 
      public: false, 
      author: exercise.author});
      // find training
      const training = await Training.findById(trainingId);
      // add exercise to training
      training.exercises.push(exerciseCopy._id);
      // update training object with new exercise
      const updatedTraining = await Training.findByIdAndUpdate({_id:trainingId}, {exercises: training.exercises}, {new: true}).populate('exercises');
      res.status(200).json(updatedTraining);
    } 
  catch(error) {
    next(error);
  }
})

// PUT /my-trainings/:trainingId/:exerciseId - modify exercise from training
router.put('/:trainingId/:exerciseId', isLoggedIn, async (req, res, next) => {
  const {exerciseId} = req.params;
  
  const {title, description, duration, sport, type, video_url, img_url} = req.body;
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate({_id:exerciseId}, {title, description, duration, sport, type, video_url, img_url}, {new: true}).populate('exercises');
    res.status(200).json(updatedExercise);
  } 
  catch(error) {
    next(error);
  }
})

// PUT /my-trainings/:trainingId/:exerciseId/delete - delete exercise from training and then delete copy
router.put('/:trainingId/:exerciseId/delete', isLoggedIn, async (req, res, next) => {
  const {trainingId, exerciseId} = req.params;
  
  try {
    // - DELETE COPY GLOBALLY
    await Exercise.findByIdAndDelete(exerciseId);
    
    // - DELETE COPY FROM TRAINING
    const training = await Training.findById(trainingId);
    var index = training.exercises.indexOf(exerciseId);
    training.exercises.splice(index,1);
    // update training
    const updatedTraining = await Training.findByIdAndUpdate({_id:trainingId}, {exercises: training.exercises}, {new: true}).populate('exercises');
    res.status(200).json(updatedTraining);
  } 
  catch(error) {
    next(error);
  }
})

// GET /my-trainings
router.get('/', isLoggedIn, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const user = await User.findById(userId).populate({path: 'trainings', model: 'Training', populate: {path: 'exercises', model: 'Exercise'}});
    res.status(200).json(user.trainings);
  } catch(error) {
    next(error);
  }  
});

module.exports = router;