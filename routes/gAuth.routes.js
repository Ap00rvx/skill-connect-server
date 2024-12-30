const express = require('express');
const passport = require('passport');
require('../passport-config'); 
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const jwt = require('jsonwebtoken');

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' ,session:false}),
  async (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '150d' });
    res.json({ token, user });
  }
);
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
