const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: function () {
            return !this.googleId; 
          },
    },
    googleId:{
        type: String,
        required: false,
        sparse : true
    },
    phone:{
        type: String,
        required: false
    },
    rating :{
        type: Number,
        required: false,
        default: 0
    },
    skills :{
        type: Array,
        required: false,
        default: []
    },
    role:{
        type: String,
        required: true,
        default: 'user'
    },
    profileImage:{
        type: String,
        required: false,
        default:""
    },
    chatRooms:{
        type: Array,
        required: false,
        default: []
    },
    bio:{
        type: String,
        required: false,
        default: ""
    },
    isVerified:{
        type: Boolean,
        required: true,
        default: false
    },
},{timeStamps: true});


const User = mongoose.model('User', UserSchema);

module.exports = User;