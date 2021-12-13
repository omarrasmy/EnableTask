const mongoose= require('mongoose')
const User=require('./User')
const validator = require('validator')

const options = {discriminatorKey: 'Type'}

const EmployeeSchema = new mongoose.Schema({
    Phone:{
        type:String,
        trim: true,
        minlength: 14,
        validate(value){
            if (!validator.isInt(value))  {
                throw ('Please Enter Numbers')
            }
        },

    },
    Marital_Status:{
        type:Boolean,
    },
    Tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }]
},options)

EmployeeSchema.methods.CheckTask = async function (taskid) {
    const result= this.Tasks.find(id => id==taskid)
    if(!result){
        return {"message":"task Add Successfully"};
    }
    throw ({ error: 'Task is Already Add To user' })
}
const Employee = User.discriminator('Employee',EmployeeSchema)

  module.exports= Employee
