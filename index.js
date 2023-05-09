const mongoose=require('mongoose');
const cookie = require('cookie-parser')
const user_route = require('./Routs/userRout')
const admin_route = require('./Routs/adminRout')
const dotenv = require('dotenv')
const express=require('express');
const path = require('path')
const app=express()
mongoose.connect(process.env.mongodb).then(()=>{
    console.log('connected');
}).catch(()=>{
    console.log('MongoDB connecton error!');
})

app.use(express.static('public'))

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin-view');

user_route.set('view engine','ejs');
user_route.set('views','./views/user-view');
user_route.use(cookie())

app.set('view engine','ejs')
app.set('views','views/user-view')

app.use('/',user_route)

app.use('/admin',admin_route)



app.listen(3000,()=>{
    console.log("server started.....")
})
