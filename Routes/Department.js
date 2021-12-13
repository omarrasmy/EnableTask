const express=require('express')
const router= new express.Router()
const Auth = require('../middleware/Auth')
const Department=require('../Controller/Department')

router.post('/SuperAdmin/CreateDepartment',Auth.AdminAuth,Department.CreateDepartment)
router.delete('/SuperAdmin/DeleteDepartment/:_id',Auth.AdminAuth,Department.DeleteDepartment)
router.get('/SuperAdmin/ListDepartmentDetails/:_id',Auth.AdminAuth,Department.GetASpecificDepartment)
router.get('/SuperAdmin/ListAllDepartments/:Count/:Page',Auth.AdminAuth,Department.GetAllDepartment)
router.patch('/SuperAdmin/UpdateDepartment/:_id',Auth.AdminAuth,Department.UpdateDepartment)

//Department Manager
router.patch('/DepartmentManager/UpdateDepartment',Auth.ManagerAuth,Department.UpdateDepartment)

module.exports=router
