const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[3,'Username must be at least 3 characters long']
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[13,'Username must be at least 3 characters long']
    },

    password:{
        type:String,
        required:true,
    },

})

const user = mongoose.model('user',userSchema)

module.exports = user