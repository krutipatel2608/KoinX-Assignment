const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoModel = new Schema({
    User_ID: String,
    UTC_Time: String,
    Operation: String,
    Market: String,
    Buy_Sell_Amount: Number,
    Price: Number
},
{
   versionKey: false
})

module.exports = mongoose.model('cryptocurrency', cryptoModel)