const mongoose = require("mongoose");
require('dotenv').config();

const mongodbUrl = process.env.MONGODB_URI

mongoose.connect(mongodbUrl)
.then(() => {
    console.log('connected to database successfully!');
})
.catch((error) => {
    console.log(error);
    console.log('error while connecting to database');
})