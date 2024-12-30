const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,{
            dbName: process.env.DB_NAME,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed');
        console.log(error);
    }
}

module.exports = connect;