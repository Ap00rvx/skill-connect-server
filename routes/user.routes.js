const {register,login,getProfile} = require('../controllers/user.controller'); 
const userMiddleware = require('../middlewares/user.middleware');
const express = require('express');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/profile",userMiddleware,getProfile);

module.exports = router;