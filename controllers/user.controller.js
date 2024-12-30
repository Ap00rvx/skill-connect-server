const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists, Please Login' });
        }
        else{
            
            const newUser = new User({ name, email, password });
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(password, salt);
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '150d' });
            const cookieOptions = {
                expires: new Date(
                    Date.now() + 150 * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };
            res.cookie('jwt', token, cookieOptions);
            await newUser.save();
            res.status(201).json({ message: 'User created successfully', user: newUser });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '150d' });
        const cookieOptions = {
            expires: new Date(
                Date.now() + 150 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
        res.cookie('jwt', token, cookieOptions);
        user = user.toObject();
        delete user.password;
        res.status(200).json({ message: 'User logged in successfully', user });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}; 

module.exports = {
    register,
    login,
    getProfile
}; 




