const express=require('express')
const router= new express.Router()
const Auth = require('../middleware/Auth')
const Tasks=require('../Controller/Tasks')

router.post('/SuperAdmin/CreateTask',Auth.AdminAuth,Tasks.CreateTask)
// router.post('/SuperAdmin/CreateNewUser',Auth.AdminAuth,Tasks.CreateUser)
// router.delete('/SuperAdmin/DeleteUser/:_id',Auth.AdminAuth,Tasks.deleteuser)
// router.get('/SuperAdmin/GetSpecificUser/:_id',Auth.AdminAuth,Tasks.GetSpecificUser)
// router.get('/SuperAdmin/SearchUsers',Auth.AdminAuth,Tasks.GetSpecificUsers)

module.exports=router
