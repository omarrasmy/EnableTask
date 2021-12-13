const jwt = require('jsonwebtoken')
const Employee = require('../model/Employee')
const Admin = require('../model/SuperAdmin')
const Manager = require('../model/DepartmentManager')


const EmployeeAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWTSEC)
        const employee = await Employee.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!employee) {
            throw new Error()
        }
        req.token = token
        req.employee = employee
        next()

    } catch (e) {
        res.status(401).send({"message":'require Authorization!'})
    }
}

const AdminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWTSEC)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!admin) {
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()

    } catch (e) {
        res.status(401).send({"message":'require Authorization!'})


    }
}
const ManagerAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWTSEC)
        const manager = await Manager.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!manager) {
            throw ({"message":'require Authorization!'})
        }
        req.token = token
        req.manager = manager
        next()

    } catch (e) {
        res.status(401).send({"message":'require Authorization!'})
    }
}
module.exports = {
    EmployeeAuth,
    AdminAuth,
    ManagerAuth
}
