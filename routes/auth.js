const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middlewares');

//  GET    '/me'
router.get('/me', isLoggedIn, (req, res, next) => {
  res.json(req.session.currentUser);
});

//  POST    '/signup'
router.post( '/signup', isNotLoggedIn, validationLoggin, async (req, res, next) => {
    const { email, name, lastName, password } = req.body;
    try {
      const userExists = await User.findOne({ email }, 'email');

      if (userExists) return next(createError(400));
      else {
        const salt = bcrypt.genSaltSync(saltRounds);                          // create slat
        const hashPass = bcrypt.hashSync(password, salt);                     // encrypt password
        const newUser = await User.create({ email, name, lastName, password: hashPass });  // create user
        req.session.currentUser = newUser;
        res.status(200).json(newUser);  // 200 OK
        console.log('----------> signed up!');
        console.log('----------> newUser', newUser);     
      }
    } catch (error) {
      next(error);
    }
  },
);

//  POST    '/login'
router.post( '/login', isNotLoggedIn, validationLoggin, async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        console.log('----------> logged in!');
        console.log('----------> user logged in', user); 
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  },
);

//  POST    '/logout'
router.post('/logout', isLoggedIn, (req, res, next) => {
  
  const { email } = req.session.currentUser;
  req.session.destroy();
  res
    .status(200) //  No Content
    .json({ message: `User with '${email}' logged out - session destroyed` });
  return;
});

// PUT '/me'
router.put('/me', isLoggedIn, async (req, res, next) => {
  const { email, name, lastName, password } = req.body;
  const userId = req.session.currentUser._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { email, name, lastName, password }, {new: true});
    res.status(200).json(updatedUser);  // 200 OK  
  } catch (error) {
    next(error);
  }
})

//  GET    '/private'   --> Only for testing - Same as /me but it returns a message instead
router.get('/private', isLoggedIn, (req, res, next) => {
  res
    .status(200) // OK
    .json({ message: 'Test - User is logged in' });
});

module.exports = router;
