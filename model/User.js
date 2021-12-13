const mongoose = require('mongoose')
const options = {discriminatorKey: 'Type'}
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const validateInteger = require('mongoose-integer')
const jwt= require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const task=require('./Tasks')
const UserSchema = new mongoose.Schema(
    {
        First_Name:{
            type:String,
            required:true,
            trim:true,
        },
        Last_Name:{
            type:String,
            trim:true
        },
        Email:{
            type:String,
            required:true,
            trim:true,
            unique : true,
            validate(value) {
                if (!validator.isEmail(value))  {
                    throw ('Please Enter a Valid Email')
                }
            }
        },
        Password:{
            type:String,
            required:true,
            trim:true,
            minlength: 6,
            validate(value) {
                if (validator.contains(value.toLowerCase(), 'password')) {
                    throw ('PASSWORD MUST NOT HAS password STRING!')
                }
            }
        }, 
        Department:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        },
        Username:{
            type:String,
            trim:true 
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
        ,
        time: Date,
    },
    options
);
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(validateInteger);

UserSchema.methods.GenerateTokens = async function () {
    const User = this
    const token = await jwt.sign({ _id: User._id.toString() }, process.env.JWTSEC)

    User.tokens = User.tokens.concat({ token })
    await User.save()

    return token
}

UserSchema.methods.toJSON =function(){
    const myAcc = this;
    const MyAccObj=myAcc.toObject();
    delete MyAccObj.Password;
    return MyAccObj;
}

// Hashing password before saving it into database

UserSchema.pre('save', async function (next) {
    const User = this
    console.log(User.Password)
    if (User.isModified('Password')) {
        User.Password = await bcrypt.hash(User.Password, 8)
    }
    next()
})

// delete SupKeys
UserSchema.pre('remove', async function (next) {
let departement = require('./Department')
    const User = this
    try{
        console.log(User.Type)
        if(User.Type == "DepartmentManager"){
          let dep= await departement.findOne({Manager_ID:this._id})
          if(dep){
              dep.Manager_ID=null
              await dep.save({validateBeforeSave:false});
          }
        }
        else{
            let Task= await task.find({Employees_ID:this._id})
            if(Task){
                for(var i=0;i<Task.length;i++){
                    // Task[i]=JSON.parse(JSON.stringify(Task[i]))
                    Task[i].Employees_ID=Task[i].Employees_ID.filter((E)=> E.toString()!= this._id)
                    console.log(Task[i])
                    x=await  Task[i].save({validateBeforeSave:false});
                }

            }
        }
    }
    catch(e){
        console.log(e)
        throw ({error:"Something went Wrong Try again Later"})
    }
    next()
})
UserSchema.statics.findByCredentials = async (Email, Password) => {

    const user = await UserModel.findOne({ Email })
    if (!user) {
        throw ('Email or Password Is Incorrect' )
    }
    const isMatch = await bcrypt.compare(Password, user.Password)
    if (!isMatch) {
        throw ('Email or Password Is Incorrect' )
    }
    return user
}

const UserModel= mongoose.model('User',UserSchema);
module.exports=UserModel;