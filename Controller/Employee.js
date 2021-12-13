const Employee = require('../model/Employee')
const Helper=require('../middleware/HelpFunctions')
const help = require('nodemon/lib/help')

exports.LogOut=async(req,res)=>{
    try{
        req.employee.tokens=req.employee.tokens.filter((t)=>{
           return t.token!==req.token
        })
        await req.employee.save()
        res.status(200).send({"message":'Logged Out successfully'})

    }catch(e){
        res.status(403).send(e)

    }

}

exports.LogOutFromAllDevices=async(req,res)=>{
    try{
        req.employee.tokens=[]
        await req.employee.save()
        res.status(200).send({"message":'Logged out from all devicess successfully'})

    }catch(e){
        res.send(403).send(e)

    }
}

//Get My Details
exports.GetMe = async(req,res)=>{
    try{
        let user = await Employee.findById(req.employee._id).populate({ path: "Tasks", select: "Task_Name Status", 
        populate: { path: "Status", select: "Status_Name" } });
        return res.status(202).send({"message":"User Found",user:user.toJSON()})
    }  
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}
exports.GetusersOfAspecificDepartment = async(req,res)=>{

 try{
     let Count = Number(req.params.Count)
     let Page = Number(req.params.Page)
    
        let user = await Employee.find({Department:req.manager.Department}).populate({ path: "Tasks", select: "Task_Name Status", 
        populate: { path: "Status", select: "Status_Name" } }).populate({path:"Department",select:"Departement_Name Departement_Code Manager_ID"});
        if(user.length==0 || !user){
             return res.status(404).send({"message":"Current Manager Are Not Assign to Department or Department Have not any Employees"});
        }
        user.forEach(e => e.toJSON());
        user=Helper.pagination(Count,Page,user)
        if(user.length ==0){
            return res.status(404).send({"message":"No More Users Found"})
        }
        return res.status(202).send({"message":"User Found",user})
    }  
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}

//Searching User Using Username , Email , Departement , Role
exports.GetSpecificUsersDependOnDepartment = async (req,res)=>{
    try{
    
    const updates = Object.keys(req.body);
    const allowed = ['Username', 'Email','Type'];
    const manager = JSON.parse(JSON.stringify(req.manager));
    if(!manager.hasOwnProperty('Department') ){
        return res.status(400).send({ error: 'You Steal not belong to specific Department' });
    }
    let UpdatedAttribues = updates.filter((update) => allowed.includes(update));
    let check = true;
    let user={},x;
    UpdatedAttribues.forEach((attribute)=>{
        if(attribute.localeCompare(allowed[0])==0){
            x=attribute;
            return;
        }
        console.log(attribute)
        user[attribute]=req.body[attribute];
    });
    user.Department=manager.Department;
    console.log(user)
    user=await Employee.find(user);
    if(x){
        user=user.filter(e => e[x].toLowerCase().includes(req.body[x].toLowerCase()));
    }
    if(user.length==0){
        return res.status(404).send({"messsage":"No User Found !"});
    }
    user=Helper.pagination(Number(req.params.Count),Number(req.params.Page),user);
    if(user.length ==0){
        return res.status(404).send({"message":"No More Pages Found"});
    }
    res.status(202).send({"message":"Found Users","user":user})
    }
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}
