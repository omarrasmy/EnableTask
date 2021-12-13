const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const validateInteger = require('mongoose-integer')
const Employee = require('./Employee')
const TaskSchema = new mongoose.Schema(
    {
        Task_Name:{
            type:String,
            trim:true,
        },
        Employees_ID:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        Status:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'   
        }
    }
);
TaskSchema.plugin(uniqueValidator);
TaskSchema.plugin(validateInteger);

TaskSchema.methods.toJSON =function(){
    const MyTask = this;
    const MyTaskObj=MyTask.toObject();
    return MyTaskObj;
}

TaskSchema.pre('remove', async function (next) {
    try{
        let task = this
        let emp = await Employee.find({"Tasks":this._id})
        if(emp){
            for(var i = 0 ;i<emp.length;i++){
               emp[i]= emp[i].Tasks.filter((e)=> e!=this._id);
               await emp[i].save();
            }
        }
    }  
    catch(e){
        throw ({error:"Something went Wrong Try again Later"})
    }
    next();
})


const TaskModel= mongoose.model('Tasks',TaskSchema);
module.exports=TaskModel;