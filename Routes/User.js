const express=require('express')
const router= new express.Router()
const Auth = require('../middleware/Auth')
const User=require('../Controller/User')

router.post('/SuperAdmin/Login/',User.Login)
router.post('/SuperAdmin/CreateNewUser',Auth.AdminAuth,User.CreateUser)
router.delete('/SuperAdmin/DeleteUser/:_id',Auth.AdminAuth,User.deleteuser)
router.get('/SuperAdmin/GetSpecificUser/:_id',Auth.AdminAuth,User.GetSpecificUser)
router.get('/SuperAdmin/SearchUsers/:Count/:Page',Auth.AdminAuth,User.GetSpecificUsers)
router.get('/SuperAdmin/GetAllUsers/:Count/:Page',Auth.AdminAuth,User.GetAllUser)
router.patch('/SuperAdmin/UpdateUser/:_id',Auth.AdminAuth,User.UpdateUser)
//manager
router.post('/DepartmentManager/Login/',User.Login)

router.post('/Employee/Login/',User.Login)

module.exports=router
