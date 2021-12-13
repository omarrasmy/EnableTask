const Task=require('../model/Tasks');
const Employee = require('../model/Employee')
const Status = require('../model/Status')
exports.CreateTask = async(req,res)=>{
    let temp=[];
    try{
        let body = JSON.parse(JSON.stringify(req.body));
        let task = {}
        if(!body.hasOwnProperty('Task_Name') || body.Task_Name==""){
            return res.status(400).send({"message":"Task Must Contain At least Name"});
        }
        task.Task_Name=body.Task_Name
        
        if(body.hasOwnProperty("Status") && body.Status != ""){
            let x = await Status.findOne({Status_Code:body.Status});
            if(!x){
                return res.status(404).send({"message":"Thier is a wrong Status ID"});
            }
        task.Status = x._id;
        }
        task = new Task(task);
        if(body.hasOwnProperty('Employees_ID') && body.Employees_ID != ""){
            for(var i=0;i<body.Employees_ID.length;i++){
                let x = await Employee.findById(body.Employees_ID[i]);
                if(!x){
                    throw ({"message":"Thier is a wrong Employee ID"});
                }
                temp.push(x);
                x.Tasks.push(task._id);
                await x.save();
            }
        } 
        task.Employees_ID=body.Employees_ID;

        await task.save();
        return res.status(200).send({"message":"Task Successfully Created","task":task.toJSON()})
    }catch(e){
        console.log(e);
        for(var i=0;i<temp.length;i++){
            temp[i].Tasks.pop();
            temp[i].save();
        }
        return res.status(404).send({"message":"something went wrong ",error:e});
    }
}

//Delete A specific user using ID
exports.DeleteTask=async (req,res)=>{
    try{
        let task = await Task.findById(req.params._id);
        await task.remove();
        return res.status(202).send({"message":"User Deleted Successfully"});
    }catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}

//Get All Users
exports.GetAllTasks = async(req,res)=>{
    try{
        const Count = Number(req.params.count);
        const Page = Number(req.params.page);
        let tasks = await Task.find({},{ skip: Page * Count, limit: Count });
        tasks.forEach((e) => e.toJSON());
        return res.status(200).send({"message":"User Successfully Created","task":tasks})

    }
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
    }
}

//remove user from task
exports.RemoveUserFromTask = async(req,res)=>{
try{
    let task = await Task.findById(req.params.Task_id);
    let emp = await Employee.findById(req.params.Emp_id);

    if(!task || !emp){
        return res.status(404).send({"message":"employee or task not found"});
    }
    task.Employees_ID=task.Employees_ID.filter((e)=>e !=req.params.Emp_id)
    await task.save();
    emp.Tasks=emp.Tasks.filter((e)=> e!=req.params.Task_id)
    await emp.save();
}
catch(e){
    console.log(e);
    return res.status(404).send({"message":"something went wrong try again later",error:e})
}
}

//update Tasks
exports.UpdateTask=async(req,res)=>{
    try{
        const updates = Object.keys(req.body);
        const allowed = ['Status','Task_Name','Employee_ID'];
        let task = await Task.findById(req.params.Task_id);
        if(!task){
            return res.status(404).send({"message":"task not found"});
        }
        for(var i = 0;i<allowed.length ; i++){
            if(req.body.hasOwnProperty(allowed[i]) && req.body[allowed[i]] !=""){
                if(allowed[i].includes("Employee_ID")){
                    let emp = await Employee.findById(req.body[allowed[i]]);
                    if(!emp){
                        return res.status(404).send({"message":"employee not found"});
                    }
                    task[allowed[i]].push(req.body[allowed[i]]);
                }
                else{
                if(allowed[i].includes("Status")){
                    let x = await Status.findById(req.body[allowed[i]]);
                    if(!x){
                        return res.status(404).send({"message":"Thier is a wrong Status ID"});
                    }
                }
                task[allowed[i]]=req.body[allowed[i]]
                }
            }   
        }
       await task.save();
       return res.status(202).send({"message":"Task Updated Successfully",task:task.toJSON()});
    }
    catch(e){
        console.log(e);
        return res.status(404).send({"message":"something went wrong try again later",error:e})
        }
  
}