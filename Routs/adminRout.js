const express = require('express')
const admin_route = express()
const bodyparser = require('body-parser')
const adminController = require('../Controllers/adminController');
const path = require('path')
const config = require('../config/session');
const session = require('express-session')
const auth = require('../middleware/auth')
const multer = require("../middleware/multer")



  



admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({ extended: true }))

admin_route.use(session({ secret: config.adminsecret }))

// admin sign in and verifying
admin_route.get('/', auth.isadnlogout, adminController.LoadSignIn)
admin_route.post('/', adminController.VerifySignin)
// dashbord  
admin_route.get('/index', auth.isadnlogin, adminController.LoadDashboard)

admin_route.get("/logout",adminController.Logout)

admin_route.get('/userdata', auth.isadnlogin, adminController.LoadUserData)
admin_route.get('/form', auth.isadnlogin, adminController.LoadForm)
admin_route.get('/chart', auth.isadnlogin, adminController.LoadChart)
admin_route.get('/widget', auth.isadnlogin, adminController.LoadWidget)
admin_route.get('/block', auth.isadnlogin, adminController.BlockUser)
admin_route.get('/catagory', auth.isadnlogin, adminController.LoadButton)
admin_route.get('/addCatagory', auth.isadnlogin, adminController.LoadAddCatogory)
admin_route.get('/categoryblock', auth.isadnlogin,adminController.BlockCategory)
admin_route.post('/addCatagory', auth.isadnlogin, adminController.AddCatagory)
admin_route.get('/editCatagory', auth.isadnlogin, adminController.LoadEditcata)
admin_route.post('/editCatagory', auth.isadnlogin, adminController.LoadUpdatecata)
admin_route.get('/deleteCatagory', auth.isadnlogin, adminController.Deletecata)
admin_route.get('/addproduct', auth.isadnlogin, adminController.AddProduct)
admin_route.post('/addproduct', auth.isadnlogin, multer.upload.array('image',5), adminController.InsertProduct)
admin_route.get('/deleteproduct', auth.isadnlogin, adminController.DeleteProduct)
admin_route.get('/editproduct', auth.isadnlogin, adminController.LoadEditProduct)
admin_route.post('/editproduct', auth.isadnlogin, multer.upload.array('image',5), adminController.AddEditProduct)
// order  routesssss...
admin_route.get('/ordercancel', auth.isadnlogin,adminController.CancelOrder)
admin_route.post('/orderstatus', auth.isadnlogin,adminController.OrderStatus)
admin_route.get('/orderdetails',adminController.OrderDetails)
admin_route.get('/view-order',adminController.vieworder)

admin_route.post('/dlt-img', auth.isadnlogin,adminController.DltImg)

admin_route.get('/salesreport', auth.isadnlogin,adminController.SalesReport)
admin_route.get('/download', auth.isadnlogin,adminController.download)
admin_route.post("/salesfilter", auth.isadnlogin,adminController.SalesFilter)

admin_route.post("/deletecoupen", auth.isadnlogin,adminController.CoupenDelete)
admin_route.get("/coupenedit", auth.isadnlogin,adminController.LoadEditCoupon)

//coupen
admin_route.get('/coupen', auth.isadnlogin,adminController.LoadCoupen)
admin_route.get('/addcoupen', auth.isadnlogin,adminController.LoadAddcoupen)
admin_route.post('/addcoupen', auth.isadnlogin,adminController.Addcoupen)




admin_route.get('*', (req, res) => {
    res.redirect('/admin')
})


module.exports = admin_route