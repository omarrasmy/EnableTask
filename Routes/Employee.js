const express=require('express')
const router= new express.Router()
const Auth = require('../middleware/Auth')
const Employee=require('../Controller/Employee')


router.get('/DepartmentManager/ListUsers/SpecificDepartment/:Count/:Page',Auth.ManagerAuth,Employee.GetusersOfAspecificDepartment)
router.get('/DepartmentManager/SearchUser/SpecificDepartment/:Count/:Page',Auth.ManagerAuth,Employee.GetSpecificUsersDependOnDepartment)
router.post('/Employee/Logout',Auth.EmployeeAuth,Employee.LogOut)
router.post('/Employee/LogoutAllDevices',Auth.EmployeeAuth,Employee.LogOutFromAllDevices)
router.get('/Employee/GetMe',Auth.EmployeeAuth,Employee.GetMe)


module.exports=router
