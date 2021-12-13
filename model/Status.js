const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const validateInteger = require('mongoose-integer')
const StatusSchema = new mongoose.Schema(
    {
        Status_Name:{
            type:String,
            trim:true,
        },
        Status_Code:{
            type:Number,
            unique : true
        },
    }
);
StatusSchema.plugin(uniqueValidator);
StatusSchema.plugin(validateInteger);

StatusSchema.methods.toJSON =function(){
    const Mystatus = this;
    const MystatusObj=Mystatus.toObject();
    return MystatusObj;
}



const StatusModel= mongoose.model('Status',StatusSchema);

module.exports=StatusModel;