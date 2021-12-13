const mongoose= require('mongoose')
const User=require('./User')
const validator = require('validator')

const options = {discriminatorKey: 'Type'}

const Dep_Mang = User.discriminator('DepartmentManager',new mongoose.Schema({
    Phone:{
        type:String,
        trim: true,
        minlength: 14,
        validate(value){
            if (!validator.isInt(value))  {
                throw new Error('Please Enter Numbers')
            }
        },

    },
    Marital_Status:{
        type:Boolean,
    },
},options))




  module.exports= Dep_Mang
