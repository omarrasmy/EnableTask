const Admin = require('../model/SuperAdmin')


exports.LogOut=async(req,res)=>{
    try{
        req.admin.tokens=req.admin.tokens.filter((t)=>{
           return t.token!==req.token
        })
        await req.admin.save()
        res.status(200).send({"message":'Logged Out successfully'})

    }catch(e){
        res.status(403).send(e)

    }

}

exports.LogOutFromAllDevices=async(req,res)=>{
    try{
        req.admin.tokens=[]
        await req.admin.save()
        res.status(200).send({"message":'Logged out from all devicess successfully'})

    }catch(e){
        res.send(403).send(e)

    }
}

//Get My Details
exports.GetMe = async(req,res)=>{
    try{
        return res.status(202).send({"message":"User Found",user:req.admin})
    }  
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}

//Create Admin
exports.CreateAdmin = async (req,res)=>{
    try{
        if(req.params._id=="3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM"){
        const isAdmin = await Admin.findOne({})
        if(isAdmin){
            return res.status(400).send({"message":'cannot create new admin'})
        }
        const admin= new Admin(req.body)
        const token=await admin.GenerateTokens()
        await admin.save()
        res.status(201).send({admin,token}) 
    }
    return res.status(404).send({"message":"UnAuthorized Access"});
    }catch(e){
        console.log(e)
        res.status(400).send(e)
     }
}