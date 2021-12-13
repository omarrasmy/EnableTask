const mongoose = require('mongoose')
const validator = require('validator')

const uniqueValidator = require('mongoose-unique-validator')
const validateInteger = require('mongoose-integer');
const DepartementSchema = new mongoose.Schema(
    {
        Departement_Name:{
            type:String,
            trim:true,
        },
        Departement_Code:{
            type:Number,
            trim:true,
            unique:true
        },
        Manager_ID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DepartmentManager',
        }
    }
);
DepartementSchema.plugin(uniqueValidator);
DepartementSchema.plugin(validateInteger);

DepartementSchema.methods.toJSON =function(){
    const MyDep = this;
    const MyDepObject=MyDep.toObject();
    return MyDepObject;
}


DepartementSchema.pre('remove', async function (next) {
    const Depart = this
    const UserModel = require('./User');
    try{
        let users= await UserModel.find({"Department":Depart._id})
    if(users){
        for(var i = 0 ;i<users.length;i++){
            users[i].Department=null
            await users[i].save();
        }
    }
    }
    catch(e){
        console.log(e)
        throw new Error({error:"Something went Wrong Try again Later"})
    }
    next()
})

const DepartementModel= mongoose.model('Department',DepartementSchema);
module.exports=DepartementModel;