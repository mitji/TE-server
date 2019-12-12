const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/User');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

// GET /edit-profile
router.get('/', isLoggedIn, (req, res, next) => {
  res.json(req.session.currentUser);
});

// PUT /edit-profile - update profile with new data
router.put('/', isLoggedIn, async (req, res, next) => {
  const {email, name, lastName, password} = req.body;
  const id = req.session.currentUser._id;
  try {
    const salt = bcrypt.genSaltSync(saltRounds);                          // create slat
    const hashPass = bcrypt.hashSync(password, salt);                     // encrypt password
    const updatedUser = await User.findByIdAndUpdate(id, {email, name, lastName, password: hashPass}, {new: true});
    console.log('----------> user updated:', updatedUser);
    res.status(200).json(updatedUser);  // 200 OK
  } catch (error) {
    next(error);
  }
});

module.exports = router;