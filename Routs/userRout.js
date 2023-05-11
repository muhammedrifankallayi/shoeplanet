const express = require('express');
const bodyparser = require('body-parser');
const user_route = express()
const userController = require('../Controllers/userController');
const session = require("express-session");
const { application } = require('express');
const config = require('../config/session');
const auth = require('../middleware/auth');
const multer = require("../middleware/multer")

const CartController = require('../Controllers/cartController')



const oneDay = 1000*60*60*24
user_route.use(session({secret:config.SessionSecret}))

user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended:true}))

//user sign up or registration
user_route.get('/register',auth.islogout,userController.LoadRegister)
user_route.post("/register",userController.InsertUser)
//home page
user_route.get('/index',auth.islogin,userController.LoadHome)
user_route.get('/',auth.islogin,userController.Loadshowhome)
//more page
user_route.get('/men',userController.LoadMen)
// main page of products
user_route.get('/women',auth.islogin,userController.LoadWoman)
user_route.get('/about',auth.islogin,userController.LoadAbout)
user_route.get('/contact',auth.islogin,userController.LoadContact)
user_route.get('/add-to-wishlist',userController.LoadAddtowishlist)

//order success page
user_route.get('/order-complete',userController.LoadOrderComplete)

//     ckeckout get and post place order
user_route.get('/checkout',auth.islogin,CartController.LoadCheckout)
user_route.post('/checkout',auth.islogin,CartController.placeOrder)


user_route.get('/cart',auth.islogin,CartController.LoadCart)
//otp verification here
user_route.get('/otp-verification',userController.LoadOtp)
user_route.post('/otp-verification',userController.VerifyOtp)
// Login and Logout ,validation
user_route.get('/login',auth.islogout,userController.LoadLogin)
user_route.post('/login',userController.ValidateLogin)
user_route.get('/logout',auth.islogin,userController.Logout)

user_route.get('/showcategory',auth.islogin,userController.ShowCatagory)
// forget password here
user_route.get('/forget',userController.Forget)
user_route.post('/forget',userController.IsForgetMail)
user_route.get('/otpforget',userController.LoadOtp)
user_route.post('/otpforget',userController.IsForgetOtp )
user_route.get('/conformpassword',userController. ConformPass)
user_route.post('/conformpassword',userController.SavePass)
// resend password
user_route.get('/resentotp',userController.ResentOtp)

//  user    profile
user_route.get('/profile',auth.islogin,userController.LoadProfile)
user_route.get('/editprofile',auth.islogin,userController.LoadEditprofile )
user_route.post('/editprofile',auth.islogin,multer.upload.single("image"),userController.Updateprofile )

// product single view and add to cart
user_route.get('/product-detail',auth.islogin,userController.LoadProductdetail)
user_route.post('/product-detail',auth.islogin,CartController.addToCart)
// cart product count increase
user_route.post('/changeCount',auth.islogin,CartController.changeCount)
user_route.get('/cartprDlt',auth.islogin,CartController.cartprDlt)
user_route.post('/cart',auth.islogin,CartController.CartData)
user_route.post('/hometoCart',auth.islogin,CartController.addToCart)




// checkout address adding 
user_route.get('/newadress',auth.islogin,CartController.newadress)
user_route.post('/newadress',auth.islogin,CartController.UserAdress)
user_route.get('/editaddress',auth.islogin,CartController.EditAddress)
user_route.post('/editaddress',auth.islogin,CartController.UpdateAddress)
user_route.get('/deleteaddress',auth.islogin,CartController.DeleteAddress)
//resend otp in register ajax
user_route.get('/resend',userController.resendotps)




//  orders view and order single view 
user_route.get('/myorders',auth.islogin,CartController.LoadMyorders)
user_route.get('/orderview',auth.islogin,CartController.OrderView)
user_route.post('/removeorder',auth.islogin,CartController.RemoveOrder)
user_route.post('/cancel-order',auth.islogin,CartController.CancelOrder)


user_route.get("/removecoupen",userController.RemoveCoupen)
user_route.get("/coupons",userController.showcoupons)


// verify payment 
user_route.post('/verifyPayment',auth.islogin,CartController.verifyOnlinePayment)

user_route.get('/pagination',auth.islogin,userController.Pagination)

user_route.post('/checkoutcoupen',auth.islogin,userController.couponaddinguser)




// search 
user_route.post("/search",auth.islogin,userController.SearchResult)

user_route.get("/sortprice",auth.islogin,userController.SortPrice)

// wallet  history...........

user_route.get("/wallet-history",auth.islogin,userController.Listwallethistory)

user_route.post("/showsize",CartController.Shoesize)



// user_route.get('*',(req,res)=>{
//     res.redirect('/index')
// })





module.exports=user_route