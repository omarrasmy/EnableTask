const mongoose= require('mongoose')
const User=require('./User')

const options = {discriminatorKey: 'Type'}

const SuperAdmin = User.discriminator('SuperAdmin',new mongoose.Schema({

},options))




  module.exports= SuperAdmin
