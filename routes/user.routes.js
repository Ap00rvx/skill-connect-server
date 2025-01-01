const {register,login,getProfile,updateProfile,changePassword,logout} = require('../controllers/user.controller'); 
const userMiddleware = require('../middlewares/user.middleware');
const express = require('express');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);


router.get("/profile",userMiddleware,getProfile);


router.put("/update",userMiddleware,updateProfile);
router.put("/change-password",userMiddleware,changePassword);


module.exports = router;