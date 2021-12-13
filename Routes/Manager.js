const express=require('express')
const router= new express.Router()
const Auth = require('../middleware/Auth')
const Manager=require('../Controller/DepartmentManager')


router.post('/DepartmentManager/Logout',Auth.ManagerAuth,Manager.LogOut)
router.post('/DepartmentManager/LogoutAllDevices',Auth.ManagerAuth,Manager.LogOutFromAllDevices)
router.get('/DepartmentManager/GetMe',Auth.ManagerAuth,Manager.GetMe)


module.exports=router
