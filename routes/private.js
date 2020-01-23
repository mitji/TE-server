const express = require('express');
const router = express.Router();

const profileRouter = require('./profile');
const editProfileRouter = require('./edit-profile');
const myTrainingsRouter = require('./my-trainings');
const exercisesRouter = require('./exercises');
const discoverRouter = require('./discover');
const searchRouter = require('./search');
const commentsRouter = require('./comments');

router.use('/profile', profileRouter);
router.use('/edit-profile', editProfileRouter);
router.use('/my-trainings', myTrainingsRouter);
router.use('/exercises', exercisesRouter);
router.use('/discover', discoverRouter);
router.use('/search', searchRouter);
router.use('/comments', commentsRouter);

module.exports = router;