const Department = require('../model/Department');
const employee = require('../model/Employee')
const Helper = require('../middleware/HelpFunctions')

const DepManger = require('../model/DepartmentManager')
exports.CreateDepartment = async (req, res) => {
    try {
        let body = JSON.parse(JSON.stringify(req.body));
        let department = {}
        if (!body.hasOwnProperty('Departement_Name') || body.Departement_Name == "") {
            return res.status(400).send({ "message": "department Must Contain At least Name" });
        }
        department.Departement_Name = body.Departement_Name
        if (!body.hasOwnProperty("Departement_Code") || body.Departement_Code == "") {
            return res.status(404).send({ "message": "department must contain a code" });
        }
        department.Departement_Code = body.Departement_Code;

        department = new Department(department);
        await department.save();
        return res.status(200).send({ "message": "Department Successfully Created", "department": department.toJSON() })
    } catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong ", error: e });
    }
}

//Delete A specific department using ID
exports.DeleteDepartment = async (req, res) => {
    try {
        let department = await Department.findById(req.params._id);
        if (!department)
            return res.status(404).send({ "messsage": "Please enter a rigth department id" })
        await department.remove();
        return res.status(202).send({ "message": "Department Deleted Successfully" });
    } catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//Get All department
exports.GetAllDepartment = async (req, res) => {
    try {
        const Count = Number(req.params.Count);
        const Page = Number(req.params.Page);
        let departments = await Department.find();
        departments = Helper.pagination(Count, Page, departments)
        departments.forEach((e) => e.toJSON());
        return res.status(200).send({ "message": "User Successfully Created", "departments": departments })

    }
    catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//List A specific Department By ID 
exports.GetASpecificDepartment = async (req, res) => {
    try {
        let department = await Department.findById(req.params._id).populate({ path: "Manager_ID", select: "Email Username First_Name Last_Name Type" });
        let emp = await employee.find({ Department: req.params._id }) || [];
        if (!department) {
            return res.status(404).send({ "message": "Wrong Department ID" })
        }
        emp.forEach((e) => e.toJSON());
        return res.status(202).send({ message: "Department Successfully found", department: department, NumberOfEmployees: emp.length, employees: emp });
    }
    catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }
}

//update department
exports.UpdateDepartment = async (req, res) => {
    try {
        let allowed = ['Departement_Name', 'Departement_Code', 'Manager_ID'];
        let department;
        if (req.hasOwnProperty('manager')) {
            department = await Department.findById(req.manager.Department);
            allowed.splice(2, 1)
        }
        else {
            department = await Department.findById(req.params._id);
        }
        if (!department) {
            return res.status(404).send({ "message": "Department not found" });
        }
        let x, y = [];
        for (var i = 0; i < allowed.length; i++) {
            if (req.body.hasOwnProperty(allowed[i]) && req.body[allowed[i]] != "") {

                if (allowed[i].includes("Manager_ID")) {
                    x = await DepManger.findById(req.body[allowed[i]]);
                    if (!x) {
                        return res.status(404).send({ "message": "Thier is a wrong Manager ID" });
                    }
                    y = await Department.find({ "Manager_ID": req.body[allowed[i]] })
                    department[allowed[i]] = req.body[allowed[i]]
                    continue;
                }
                department[allowed[i]] = req.body[allowed[i]]
            }
        }
        await department.save({ validateBeforeSave: false });
        if (x) {
            for (var n = 0; n < y.length; n++) {
                y[n].Manager_ID = null;
                console.log(y[n])
                await y[n].save({ validateBeforeSave: false })
            }
            x.Department = department._id;
            await x.save()
        }
        return res.status(202).send({ "message": "Department Updated Successfully", department: department.toJSON() });
    }
    catch (e) {
        console.log(e);
        return res.status(404).send({ "message": "something went wrong try again later", error: e })
    }

}