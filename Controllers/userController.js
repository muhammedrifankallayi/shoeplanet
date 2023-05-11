const express = require('express');
const Users = require('../model/userModel');
const bcrypt = require('bcrypt');
const { findOne, findById } = require('../model/userModel');
const nodemailer = require('nodemailer')
const Product = require('../model/productModel');
const Category = require('../model/catagoryModel')
const Cart = require('../model/cartModel');
const cartModel = require('../model/cartModel');
const Coupon = require('../model/coupenModel')
const Address = require("../model/addressModel")
const dotenv = require('dotenv')
const Razorpay = require('razorpay');
const { search } = require('../Routs/userRout');
const Wallet = require("../model/walletHistory")

dotenv.config()



let temp
let cartsize
const limit = 5;





const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}

function generateOTP() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`


const Loadshowhome = (req, res) => {
    try {
        res.render('showhome')
    } catch (error) {
        console.log(error.message);
    }
}




const LoadHome = async (req, res) => {
    try {
        const cartsizes = await Cart.aggregate([{
            $match: {
                user_id: Login_id
            }
        }])
        const data = await Product.find()
        cartsize = cartsizes.length

        const uids = req.query.id
        res.render('index', { id: uids, cartsize,data })

    } catch (error) {
        console.log(error.message);
    }
}
const LoadMen = async (req, res) => {
    try {
        res.render('men', { cartsize })
    } catch (error) {
        console.log(error.message);
    }
}
const LoadWoman = async (req, res) => {
    try {
        const total = await Product.find()
        const size = Math.ceil(total.length / limit)
        const Data = await Product.find().limit(limit)
        const categories = await Category.find()
        res.render('women', { data: Data, nextpage: true, tagId: 'page-1-link', categories, category: '', size, search: '',sort:'' })
    } catch (error) {
        console.log(error.message);
    }
}
const LoadAbout = async (req, res) => {
    try {
        res.render('about', { cartsize })
    } catch (error) {
        console.log(error.message);
    }
}
const LoadContact = async (req, res) => {
    try {
        res.render('contact', { cartsize })
    } catch (error) {
        console.log(error.message);
    }
}
const LoadAddtowishlist = (req, res) => {
    try {
        res.render('add-to-wishlist', { cartsize })
    } catch (error) {
        console.log(error.message);
    }
}
const LoadProductdetail = async (req, res) => {
    try {
        const Id = req.query.id
        const Data = await Product.findById({ _id: Id })
        res.render('product-detail', { detail: Data, cartsize })
    } catch (error) {
        console.log(error.message);
    }
}
const LoadOrderComplete = (req, res) => {
    try {
        res.render('order-complete', { cartsize })
    } catch (error) {
        console.log(error.message);
    }
}




const LoadRegister = (req, res) => {
    try {
        res.render('register', { msg: ' ' })
    } catch (error) {
        console.log(error.message);
    }
}

const LoadOtp = (req, res) => {
    try {
        res.render('otp-verification', { msg: ' ' })
    } catch (error) {
        console.log(error.message);
    }
}

const LoadLogin = (req, res) => {
    try {
        res.render('user-login', { msg: ' ' })
    } catch (error) {
        console.log(error.message);
    }
}


var otp = generateOTP();



//nodemailer otp sending......................

function sendotp(Email) {
    otp = generateOTP()
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    });
    const mailOptions = {
        from: 'esample157@gmail.com',
        to: Email,
        subject: 'Your OTP code',
        text: `Your OTP code is ${otp}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {

            console.log(`Email sent: ${info.response}`);
        }
    });
}



const InsertUser = async (req, res) => {

    try {
        const isEmail = await Users.findOne({ email: req.body.email })

        if (isEmail) {
            res.render('register', { msg: 'email is already exist' })
        } else {


            if (req.body.username.trim() == '') {
                res.render('register', { msg: "Please enter your name" })
            } else {
                temp = req.body.email
                if (req.body.password == req.body.Rpassword) {
                    const spassword = await securePassword(req.body.password);
                    const email = req.body.email
                    const mobile = req.body.mobile
                    const username = req.body.username

                    await sendotp(req.body.email)

                    res.redirect('/otp-verification?username=' + username + "&email=" + email + '&mobile=' + mobile + '&Pass=' + spassword)
                } else {
                    res.render('register', { msg: "Password does not match" })
                }
            }


        }

    } catch (error) {
        console.log(error.message);
    }
}


const VerifyOtp = async (req, res) => {



    try {
        const UserOtp = req.body.otp
        console.log(req.query.email);
        if (otp == UserOtp) {

            const user = new Users({
                username: req.query.username,
                mobile: req.query.mobile,
                Date:new Date(),
                email: req.query.email,
                password: req.query.Pass,
                is_verified: 1,
                is_admin: 0


            })
            const userData = await user.save()
            if (userData) {
                res.redirect('/login')
            } else {
                res.render('otp-verification', { msg: 'somthing went wrong try again' })
            }

        } else {
            res.render('otp-verification', { msg: 'incorrect OTP please try again!!' })

        }
    } catch (error) {
        console.log(error.message);
    }

}

var Login_id
const ValidateLogin = async (req, res) => {

    const password = req.body.password
    const email = req.body.email
    try {
        if (password.trim() == '' || email.trim() == '') {
            res.render('user-login', { msg: 'Your password or email incorrect ,please try again !!' })
        } else {
            const isEmail = await Users.findOne({ email: email })

            if (isEmail) {
                if (isEmail.is_verified == 1) {
                    const passwordcheck = await bcrypt.compare(password, isEmail.password)
                    if (passwordcheck) {
                        Login_id = isEmail._id
                        req.session.user_id = isEmail._id
                        res.redirect('/index?id=' + isEmail._id)
                        console.log(req.session.user_id);

                    } else {
                        res.render('user-login', { msg: 'Your password incorrect ,please try again !!' })
                    }
                } else {
                    res.render('user-login', { msg: 'You are Blocked !!' })
                }

            } else {
                res.render('user-login', { msg: 'You are  Not registered ' })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
const Logout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error.message);
    }
}

const ShowCatagory = async (req, res) => {
    try {
        const Id = req.query.id
        const total = await Product.find({ catagory: Id })
        const size = Math.ceil(total.length / limit)

        const categories = await Category.find()
        const Data = await Product.find({ catagory: Id }).limit(limit)
        res.render('women', { data: Data, cartsize, tagId: 'page-1-link', nextpage: true, categories, category: Id, size, search: '',sort:'' })

    } catch (error) {
        console.log(error.message);
    }
}

const Forget = (req, res) => {
    try {
        res.render('forget', { msg: ' ' })
    } catch (error) {
        console.log(error.message);
    }
}
const IsForgetMail = async (req, res) => {

    try {

        const userData = await Users.findOne({ email: req.body.email })
        const Uid = userData._id
        if (userData) {
            temp = userData._id
            await sendotp(req.body.email)

            res.redirect('/otpforget?id=' + Uid)
        } else {
            res.redirect('/forget')
        }
    } catch (error) {
        res.render('forget', { msg: 'no such a email adress' })
        console.log(error.message);
    }
}

const IsForgetOtp = async (req, res) => {
    try {
        const Id = req.query.id
        const otpforget = req.body.otp

        if (otpforget == otp) {
            res.redirect('/conformpassword?id=' + Id)
        } else {
            res.render('otp-verification', { msg: 'incorrect OTP!! please try again!' })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const ConformPass = async (req, res) => {
    try {
        res.render('conformpassword')
    } catch (error) {
        console.log(error.message);
    }
}


const SavePass = async (req, res) => {

    const spass = await securePassword(req.body.password1)
    try {
        const Uid = req.query.id
        const pass1 = req.body.password1
        const pass2 = req.body.password2
        if (pass1 == pass2) {

            const updated = await Users.findByIdAndUpdate({ _id: Uid }, { $set: { password: spass } })


            if (updated) {

                res.redirect('/login')
            } else {
                res.redirect('/register')
            }
        } else {
            res.redirect('/register')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const ResentOtp = async (req, res) => {

    try {
        otp = generateOTP()
        const userdata = await Users.findById({ _id: temp })
        console.log(temp);
        await sendotp(userdata.email)

        res.redirect('/otpforget?id=' + temp)
    } catch (error) {
        console.log(error.message);
    }
}
const LoadProfile = async (req, res) => {
    try {
        const userData = await Users.findById({ _id: req.session.user_id })
        const address = await Address.findOne({user_id:userData._id})
        console.log(address);
        console.log(address+"ok");
        const coupon = await Coupon.find({status:true}).limit(2)
        res.render('profile', { user: userData,address,coupon })
    } catch (error) {
        console.log(error.log);
    }
}
const LoadEditprofile = async(req,res)=>{
    try {
const data = await Users.findOne({_id:req.session.user_id})

        res.render("editprofile",{data})
    } catch (error) {
        console.log(error.message);
    }
}

const Updateprofile = async(req,res)=>{
    try {
        await Users.updateOne({_id:req.session.user_id},
            {$set:{username:req.body.name,
                mobile:req.body.mobile,
                email:req.body.email,
                image:req.file.filename
        }})
        res.redirect("/profile")
    } catch (error) {
        console.log(error.message);
    }
}





//signup otp resend


const resendotps = async (req, res) => {
    try {
        console.log('send');
        await sendotp(temp)
    } catch (error) {
        console.log(error.message);
    }
}

const Pagination = async (req, res) => {
    const tagId = req.query.id
    const category = req.query.category
    const page = parseInt(req.query.page) || 1;  // get the requested page number


    const startIndex = (page - 1) * limit;  // calculate the starting index of the records to retrieve

    try {
        const sort = parseInt(req.query.sort)
        const search = req.query.search
        const total = await Product.find()
        const size = Math.ceil(total.length / limit)
        const categories = await Category.find()
        if (category) {
            const total = await Product.find({ catagory: category })
            if(sort){
                const users = await Product.find({ catagory: category }).skip(startIndex).limit(limit).sort({price:sort})
                const zsize = Math.ceil(total.length / limit)

            res.render('women', { data: users, nextpage: false, tagId, categories, category: category, size: zsize, search: '',sort })
            }else{
                const users = await Product.find({ catagory: category }).skip(startIndex).limit(limit);  // retrieve the records from the database
                const zsize = Math.ceil(total.length / limit)
    
                res.render('women', { data: users, nextpage: false, tagId, categories, category: category, size: zsize, search: '',sort })
            }
           
        } else if (search) {
            if(sort){
                const total = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] })
                const data = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).skip(startIndex).limit(limit).sort({price:sort})
                const size = Math.ceil(total.length / limit)
                res.render('women', { data, nextpage: true, tagId, categories, category: '', size, search,sort })
            }else{
                const total = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] })
                const data = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).skip(startIndex).limit(limit)
                const size = Math.ceil(total.length / limit)
                res.render('women', { data, nextpage: true, tagId, categories, category: '', size, search,sort })
            }
           
        }
        else {
            if(sort){
                const users = await Product.find().skip(startIndex).limit(limit).sort({price:sort});  // retrieve the records from the database

                res.render('women', { data: users, nextpage: false, tagId, categories, category: '', size, search: '',sort })
            }else{
                const users = await Product.find().skip(startIndex).limit(limit);  // retrieve the records from the database

                res.render('women', { data: users, nextpage: false, tagId, categories, category: '', size, search: '',sort })
            }
            
        }

    } catch (error) {
        console.log(error.message);
    }
}


const couponaddinguser = async (req, res) => {
    try {
        const code = req.body.coupon;
        req.session.code = req.body.coupon
        console.log(req.session.code + 'rashid');

        const amount = req.body.amount
        const userExist = await Coupon.findOne({ couponcode: code, user: { $in: [req.session.user_id] } });

        if (userExist) {
            console.log("user");
            res.json({ user: true });
        } else {
            const couponData = await Coupon.findOne({ couponcode: code });
            console.log(couponData);
            if (couponData) {
                if (couponData.limit <= 0) {
                    console.log('limit');
                    res.json({ limit: true });
                } else {
                    if (couponData.status == false) {
                        console.log('status');
                        res.json({ status: true })
                    } else {
                        if (couponData.expiredate <= new Date()) {
                            console.log('date');
                            res.json({ date: true });
                        } else {
                            if (couponData.purchaceamount >= amount) {
                                console.log('amount');
                                res.json({ cartAmount: true });
                            } else {
                                console.log('ok');
                                await Coupon.findByIdAndUpdate({ _id: couponData._id }, { $push: { user: req.session.user_id } });
                                await Coupon.findByIdAndUpdate({ _id: couponData._id }, { $inc: { limit: -1 } });

                                const disAmount = couponData.discount;
                                const discTotal = Math.round(amount - disAmount);
                                const disTotal = discTotal

                                return res.json({ amountOkey: true, disAmount, disTotal });

                            }
                        }
                    }
                }
            } else {
                res.json({ invalid: true });
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}


const SearchResult = async (req, res) => {
    try {
        const categories = await Category.find()
        const total = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] })

        if (req.body.category) {
            const search = req.body.search
            console.log(req.body.category);
            console.log(search);
           
            const size = Math.ceil(total.length / limit)
            const data = await Product.find({ catagory: req.body.category, $or: [{ name: { $regex: ".*" + search + ".*", $options: 'i' } }] })
            res.render('women', { data, nextpage: true, tagId:'page-1-link', categories, category: req.body.category, search, size, sort: '' })
        }
        else if(req.body.search){
            const search = req.body.search
            const totals = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] })
            const data = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).limit(limit)
            
            if(data.length>0){
                const size = Math.ceil(totals.length / limit)
                res.render('women', { data, nextpage: true,tagId:'page-1-link',categories, category: '', size, search, sort: '' })
            }else{
                res.render('cartEmpty', { msg:'Oops! No such a products found ' })
            }
          
        }
        else {
            res.render('cartEmpty', { msg:'Oops! No such a products found ' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const SortPrice = async (req, res) => {
    try {
        const search = req.query.search
        const id = parseInt(req.query.id)
        const category = req.query.category
        const categories = await Category.find()
        if (search) {

            const total = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).sort({ price: id })
            const size = Math.ceil(total.length / limit)
            const data = await Product.find({ block: 0, $or: [{ catagory: search }, { name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).limit(limit).sort({ price: id })
            res.render('women', { data, nextpage: true, tagId: 'page-1-link', categories, category, search, size, sort: id })
        } else if (category) {
            const total = await Product.find({ catagory: category, $or: [{ name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).sort({ price: id })
            const size = Math.ceil(total.length / limit)
            const data = await Product.find({ catagory: category, $or: [{ name: { $regex: ".*" + search + ".*", $options: 'i' } }] }).limit(limit).sort({ price: id })
            res.render('women', { data, nextpage: true, tagId: 'page-1-link', categories, category, search, size, sort: id })
        } else {
            const data = await Product.find().sort({ price: id }).limit(limit)
            const total = await Product.find().sort({ price: id })
            const size = Math.ceil(total.length / limit)
            console.log('hello');
            res.render('women', { data, nextpage: true, tagId: 'page-1-link', categories, category, search, size, sort:id })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const RemoveCoupen = async(req,res)=>{
    try {

   const check =  await Coupon.findOne({couponcode:req.session.code})
      if(check.is_placed == false){
        const data = await Coupon.findOneAndUpdate({couponcode:req.session.code},{$pull:{user:req.session.user_id}})
if(data){
    console.log('hello');
    res.json({success:true})
}
      }else{
        res.json({false:true})
      }
const data = await Coupon.findOneAndUpdate({couponcode:req.session.code},{$pull:{user:req.session.user_id}})
if(data){
    console.log('hello');
    res.json({success:true})
}



    } catch (error) {
        console.log(error.message);
    }
}
const showcoupons  = async (req,res)=>{
    try {
        const data = await Coupon.find({user:{$ne:req.session.user_id}})
        res.render("coupons",{data}) 
    } catch (error) {
        console.log(error.message);
    }
}
const Listwallethistory = async(req,res)=>{
    try {

const data  = await Wallet.find({userId:req.session.user_id})

       res.render("wallet-history",{data}) 
    } catch (error) {
        console.log(error.message);
    }
}






module.exports = {
    Loadshowhome,
    LoadHome,
    LoadMen,
    LoadAbout,
    LoadContact,
    LoadWoman,        // product page
    LoadAddtowishlist,
    LoadProductdetail,
    LoadOrderComplete,
    LoadRegister,
    InsertUser,
    LoadOtp,
    VerifyOtp,  // otp for sign up
    LoadLogin,
    ValidateLogin,  // login validading
    Logout,
    ShowCatagory,   // category page
    Forget,
    IsForgetMail,
    IsForgetOtp,
    ConformPass,
    SavePass,
    ResentOtp,
    LoadProfile,  // user profile
    LoadEditprofile,
    Updateprofile,
    resendotps,
    Pagination,   // pagination page
    couponaddinguser,
    SearchResult,
    SortPrice,
    RemoveCoupen,
    showcoupons,
   
    Listwallethistory


}