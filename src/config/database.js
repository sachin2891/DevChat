const mongoose = require('mongoose');
require('dotenv').config();


const connectDb = async () => {
    await mongoose.connect(
        process.env.MONGODB_PORT
    )
}

module.exports = connectDb;