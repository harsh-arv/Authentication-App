const mongoose = require('mongoose');


// creating schema to add data in the database
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true 
    },
    name : {
        type : String,
        required : true
    }
},{
    timestamps: true
})


const User = mongoose.model('User', userSchema);

module.exports = User;