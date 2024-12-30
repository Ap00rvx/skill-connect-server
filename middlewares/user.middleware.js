const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const cookieParser = require('cookie-parser');
require('dotenv').config();



const userMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                req.user = null;
                res.clearCookie('jwt');
               return  res.send({ message: "Please login to access this route" });
            } else {
                let user = await User.findById(decodedToken.id);
                req.user = user;
                next();
            }
        })
    } else {
        req.user = null;
        return res.send({ message: "Please login to access this route" });
        
    }
}
module.exports = userMiddleware;