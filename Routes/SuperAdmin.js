const express=require('express')
const router= new express.Router()
const Auth = require('../middleware/Auth')
const AdminController=require('../Controller/SuperAdmin')

router.post('/SuperAdmin/SignUp/:_id',AdminController.CreateAdmin)
router.post('/SuperAdmin/Logout',Auth.AdminAuth,AdminController.LogOut)
router.get('/SuperAdmin/Getme',Auth.AdminAuth,AdminController.GetMe)
router.post('/SuperAdmin/LogoutFromAllDevices',Auth.AdminAuth,AdminController.LogOutFromAllDevices)

module.exports=router
