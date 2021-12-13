const User = require('../model/User');
const validator = require('validator')
const Helper = require('../middleware/HelpFunctions')
const Emp = require('../model/Employee')
const Manager = require('../model/DepartmentManager')
const dep = require('../model/Department');
//add new User
exports.CreateUser = async (req, res) => {
    try {
        let body = JSON.parse(JSON.stringify(req.body));
        let user = { Last_Name: "" }
        if (!body.hasOwnProperty('Type') || body.Type == "" || !body.hasOwnProperty('First_Name') || body.First_Name == "" || !body.hasOwnProperty('Email') || body.Email == "" || !body.hasOwnProperty('Password') || body.Password == "") {
            return res.status(404).send({ "message": "First Name,Email,Password Is Required" });
        }
        if (body.hasOwnProperty('Last_Name') && body.Last_Name != "") {
            user.Last_Name = body.Last_Name;
        }
        if (body.hasOwnProperty('Type') && body.Type != "") {
            if (!validator.isInt(body.Type, { min: 1, max: 3 })) {
                return res.status(404).send({ "message": "Please Send Rigth Type Of User" })
            }
            if (body.Type == 2) {
                user.Type = "DepartmentManager";
            }
            else {
                user.Type = "Employee"
            }
        }
        if (body.hasOwnProperty('Department') && body.Department != "") {
            user.Department = body.Department;
        }
        if (body.hasOwnProperty("Username") && body.Username != "") {
            user.Username = body.Username;
        }
        user.First_Name = body.First_Name;
        user.Email = body.Email;
        user.Password = body.Password;
        user.time = Date.now();
        user = new User(user);
        await user.save();
        return res.status(200).send({ "message": "User Successfully Created", "user": user.toJSON() })
    } catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong ", error: e });
    }
}

//Delete A specific user using ID
exports.deleteuser = async (req, res) => {
    try {
        let user = await User.findById(req.params._id);
        if (!user) {
            return res.status(404).send({ "message": "please Send A Write ID" })
        }
        await user.remove();
        return res.status(202).send({ "message": "User Deleted Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//Get A particular user using ID
exports.GetSpecificUser = async (req, res) => {
    try {
        let user = await User.findById(req.params._id);
        if (!user) {
            return res.status(404).send({ "message": "User Not Found" });
        }
        if (user.Type == "Employee") {
            await user.populate({ path: "Tasks", select: "Task_Name Status", populate: { path: "Status", select: "Status_Name" } })
        }
        await user.populate({ path: "Department", select: "Departement_Name Departement_Code" })
        return res.status(202).send({ "message": "User Successfully Created", "user": user.toJSON() })
    }
    catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//Get All Users
exports.GetAllUser = async (req, res) => {
    try {
        const Count = Number(req.params.Count);
        const Page = Number(req.params.Page);
        let users = await User.find();
        users = Helper.pagination(Count, Page, users);
        users.forEach((e) => e.toJSON());
        return res.status(200).send({ "message": "User Successfully Created", "user": users })

    }
    catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//Searching User Using Username , Email , Departement , Role
exports.GetSpecificUsers = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowed = ['Username', 'Email', 'Departement', 'Type'];
        const UpdatedAttribues = updates.filter((update) => allowed.includes(update))
        if (UpdatedAttribues.length == 0) {
            return res.status(400).send({ error: 'No exisited properity' })
        }
        let user = {}, x;
        UpdatedAttribues.forEach((attribute) => {
            if (attribute.localeCompare(allowed[0]) == 0) {
                x = attribute;
                return;
            }
            user[attribute] = req.body[attribute];
        });
        user = await User.find(user);
        if (x) {
            user = user.filter((e) => {
                e = JSON.parse(JSON.stringify(e))
                if (e.hasOwnProperty(x)) {
                    if (e[x].toLowerCase().includes(req.body[x].toLowerCase())) {
                        return e[x];
                    }
                }
            })
        }
        if (user.length == 0) {
            return res.status(404).send({ "messsage": "No User Found !" });
        }
        user = Helper.pagination(Number(req.params.Count), Number(req.params.Page), user);
        if (user.length == 0) {
            return res.status(404).send({ "message": "No More Pages Found" });
        }
        res.status(202).send({ "message": "Found Users", "user": user })
    }
    catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}
exports.UpdateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowed = ['Username', 'Last_Name', 'Department', 'Password'];
        let user = await User.findById(req.params._id);
        if (!user) {
            return res.status(404).send({ "message": "Wrong user ID" })
        }
        let x;
        console.log(req.body.Department);
        if (req.body.hasOwnProperty("Department") && req.body.Department != "") {
            x = await dep.findOne({ "Departement_Code": req.body.Department })
            if(!x){
                 throw ("Please Enter A rigth Department Code");
            }
        }
        if (user.Type == 'DepartmentManager') {
            if (updates.includes('Department')) {
                if (x._id != user.Departement) {
                    y = await dep.findById(user.Department)
                    if(y){
                        y.Manager_ID=null
                        await y.save({validateBeforeSave:false});
                    }   
                    user.Department = x._id
                    allowed.splice(2, 1)
                }
                x.Manager_ID=user._id
                await x.save({validateBeforeSave:false})
            }
        }
        for (var i = 0; i < allowed.length; i++) {
            if (req.body.hasOwnProperty(allowed[i]) && req.body[allowed[i]] != "") {
                if (allowed[i] == 'Department') {
                    console.log(x._id);
                    user.Department = x._id.toString();
                    continue;
                }
                user[allowed[i]] = req.body[allowed[i]];
            }
        }
        await user.save();
        return res.status(202).send({"message":"user update Successfully",user:user.toJSON()});
    } catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//login
exports.Login = async (req, res) => {

    try {
        let result = await Helper.Login({ Email: req.body.Email, Password: req.body.Password });
        res.status(202).send(result);
    } catch (e) {
        console.log(e)
        res.status(404).send({ Error: e })
    }

}