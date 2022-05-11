const express = require('express');
require('dotenv').config({ path: './configurations/dev.env' })
require('./db-con/mongoose')

const app = express()

 

//secure for access of other domains.
// app.use((req, res, next) => {
//     var allowedOrigins = ['https://realquizly.web.app', 'http://localhost:3000' , "https://youthful-boyd-4eb098.netlify.app" ];
//     var origin = req.headers.origin;
//     if (allowedOrigins.indexOf(origin) > -1) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     res.append('Access-Control-Allow-Headers', 'Authorization');
//     next();
// });


var http = require('http').createServer(app);

const port = process.env.PORT;

const User= require('./Routes/User')
const Tasks=require('./Routes/Tasks')
const Department = require('./Routes/Department')
const SuperAdmin=require('./Routes/SuperAdmin')
const Employee =require('./Routes/Employee')
const Manager = require('./Routes/Manager')
app.use(express.json())
app.use(User)
app.use(Tasks)
app.use(Department)
app.use(SuperAdmin)
app.use(Employee)
app.use(Manager)


http.listen(port, function () {
    console.log("Listening on ", port);
});


