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
        res.status(200).json({ user : user.select('-password') });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}; 
const logout = async (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({ message: 'User logged out successfully' });
}
const changePassword = async(req,res) => {
    const {oldPassword,newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        } 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });

    }
    catch(err){
        console.error(err);
        res.status(500).send({ message: err });
    }
}

const updateProfile = async(req,res) => {
    const {name,phone,skills,bio,profileImage} = req.body;
    try {
        let user = await User.findById(req.user.id) ; 
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.skills = skills || user.skills;
        user.bio = bio || user.bio;
        user.profileImage = profileImage || user.profileImage;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user : user.select('-password') });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ message: err });
    }
}
const verifyUser = async (req,res) => {
    const {email} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        user.isVerified = true;
        await user.save();
    }
    catch(err){
        console.error(err);
        res.status(500).send({ message: err });
    }
}
    

module.exports = {
    register,
    login,
    getProfile,
    logout,
    verifyUser,
    changePassword,
    updateProfile
}; 




