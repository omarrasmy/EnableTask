const Manager = require('../model/DepartmentManager')

exports.LogOut=async(req,res)=>{
    try{
        req.manager.tokens=req.manager.tokens.filter((t)=>{
           return t.token!==req.token
        })
        await req.manager.save()
        res.status(200).send({"message":'Logged Out successfully'})

    }catch(e){
        res.status(403).send(e)

    }

}

exports.LogOutFromAllDevices=async(req,res)=>{
    try{
        req.manager.tokens=[]
        await req.manager.save()
        res.status(200).send({"message":'Logged out from all devicess successfully'})

    }catch(e){
        res.send(403).send(e)

    }
}

//Get My Details
exports.GetMe = async(req,res)=>{
    try{
        return res.status(202).send({"message":"User Found",user:req.manager})
    }  
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}
