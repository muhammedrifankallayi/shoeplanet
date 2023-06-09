const Users = require('../model/userModel')
const Catagory = require('../model/catagoryModel')
const Product = require('../model/productModel')
const Coupen = require('../model/coupenModel')
const Address = require('../model/addressModel')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const Order = require('../model/orderModel')
const sharp = require('sharp')
// const PDFCreator = require("pdf-creator-node");
// const ejs = require('ejs')
// const pdf = require('html-pdf')
const cloudinary = require('cloudinary').v2;

const limit = 5
//this is the timing

// Configuration 
cloudinary.config({
    cloud_name: "dwgjltcnm",
    api_key: "121164443511553",
    api_secret: "R4JcTMfn1ZEIRFRq3jkh0G1kteo"
  });
  


const Logout = async(req,res)=>{
    try {
       req.session.destroy()
       res.redirect("/admin/") 
    } catch (error) {
        
    }
}


const LoadDashboard = async(req,res)=>{
    try {
       
     
                const orderData = await Order.find({ status: { $ne: "Cancelled" } })
        
                let SubTotal = 0
                orderData.forEach(function (value) {
                    SubTotal = SubTotal + value.totalAmount;
                })
       
                const cod = await Order.find({ paymentMethod: "COD" }).count()
                const online = await Order.find({ paymentMethod: "banktransfer" }).count()
                const totalOrder = await Order.find({ status: { $ne: "cancelled" } }).count()
                const totalUser = await Users.find().count()
                const totalProducts = await Product.find().count()
        
                const date = new Date()
                const year = date.getFullYear()
                const currentYear = new Date(year, 0, 1)
        
                const salesByYear = await Order.aggregate([
                    {
                        $match: {
                            date: { $gte: currentYear }, status: { $ne: "Cancelled" }
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%m", date:  "$date" } },
                            total: { $sum: "$totalAmount" },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } }
                ])
               //user progressssss


            

const userCountByMonth = await Users.aggregate([
  {
    $match: {
      Date: { $gte: currentYear } // get all user records created from the start of the current year
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%m", date: "$Date" } }, // group by month and year
      total: { $sum: 1 },
      count: { $sum: 1 } // calculate the total count of users for each month
    }
  },
  {
    $sort: { _id: 1 } // sort by month in ascending order
  }
]);

        
      
                let sales = []
                for (i = 1; i < 13; i++) {
                    let result = true
                    for (j = 0; j < salesByYear.length; j++) {
                        result = false
                        if (salesByYear[j]._id == i) {
                            sales.push(salesByYear[j])
                            break;
                        } else {
                            result = true
        
                        }
                    }
                    if (result) {
                        sales.push({ _id: i, total: 0, count: 0 })
                    }
        
                }
        
                let yearChart = []
                for (i = 0; i < sales.length; i++) {
                    yearChart.push(sales[i].total)
                }
      console.log(yearChart);

// users progress
let user = []
for (i = 1; i < 13; i++) {
    let result = true
    for (j = 0; j < userCountByMonth.length; j++) {
        result = false
        if (userCountByMonth[j]._id == i) {
            user.push(userCountByMonth[j])
            break;
        } else {
            result = true

        }
    }
    if (result) {
        user.push({ _id: i, total: 0, count: 0 })
    }

}

let yearChartuser = []
for (i = 0; i < user.length; i++) {
    yearChartuser.push(user[i].total)
}
let salescount = []
for (i = 0; i < sales.length; i++) {
    salescount.push(sales[i].count)
}



        
                res.render('index', { data: orderData, total: SubTotal, cod, online, totalOrder, totalUser, totalProducts, yearChart ,yearChartuser,salescount})
        
           
        
    } catch (error) {
        console.log(error.message);
    }
}
const LoadSignIn = async(req,res)=>{
    try {
        res.render('signin')
    } catch (error) {
        console.log(error.message);
    }
}
const LoadUserData = async(req,res)=>{
    try {
        const users = await Users.find()
        res.render('table',{data:users})
    } catch (error) {
        console.log(error.message);
    }
}
const LoadChart = async(req,res)=>{
    try {
        res.render('chart')
    } catch (error) {
        console.log(error.message);
    }
}
const LoadForm = async(req,res)=>{
    try {
        const Data = await Product.find()
        res.render('form',{products:Data})
    } catch (error) {
        console.log(error.message);
    }
}
const VerifySignin = async(req,res)=>{
    try {
        const mail = req.body.email
        const pass= req.body.password
        const userdata = await Users.findOne({email:mail})
if(userdata && userdata.is_admin==1){
    req.session.userid=userdata._id
const isPass = await bcrypt.compare(pass,userdata.password)
if(isPass){
    res.redirect('/admin/index')
}else{
    res.render('signin',{message:'incorrect password or email'})
}
}else{
    
    res.render('signin',{message:'You are not a Admin!'})

}

    } catch (error) {
        console.log(error.message);
    }
}

const LoadWidget = async(req,res)=>{
    try {

const sdate = req.query.sdate
const edate = req.query.edate
const page = parseInt(req.query.page)
const stx = (page-1)*limit
const span_id = req.query.spanid || 'spanid1'
let orderData
let total
let size

if(sdate){
     orderData = await Order.find({date:{$gte:sdate,$lte:edate}}).sort({date:-1}).skip(stx).limit(limit)

     total =  ( await Order.find({date:{$gte:sdate,$lte:edate}})).length
     size = Math.ceil(total/limit) 
}else{

 orderData = await Order.find().sort({date:-1}).skip(stx).limit(limit)

total =  (await Order.find()).length
 size = Math.ceil(total/limit)
}



        res.render('widget',{data:orderData,span_id,sdate,edate,size,page})
    } catch (error) {
        console.log(error.message);
    }
}
const BlockUser = async(req,res)=>{
    try {
        const Id= req.query.id
        const Unblock=req.query.data

await Users.updateOne({_id:Id},{$set:{is_verified:0}})
res.redirect('/admin/userdata')
if(Unblock){
    await Users.updateOne({_id:Id},{$set:{is_verified:1}})
    res.redirect('/admin/userdata')
}


    } catch (error) {
        console.log(error.message);
    }
}
const LoadButton = async(req,res)=>{
    try {
        const Data = await Catagory.find()
        res.render('catagory',{data:Data})
    } catch (error) {
        console.log(error.message);
    }
}
const LoadAddCatogory = async(req,res)=>{
    try {
        res.render('addCatagory',{msg:' '})
    } catch (error) {
        console.log(error.message);
    }
}

const AddCatagory = async(req,res)=>{
    try {
        
        const NewCategory = req.body.catagory
const cataData = await Catagory.findOne({catagory:{ $regex: new RegExp("^" + NewCategory + "$", "i") }})
if(cataData){
    res.render('addcatagory',{msg:'Category already exist!!'})
}else{
if(NewCategory.trim()==''){
    res.render('addcatagory',{msg:' please Enter!! category name '})
}else{

        const add = new Catagory({
            catagory:NewCategory
        })
        const Data =await add.save()
        if(Data){
            res.redirect('/admin/catagory')
        }
    }
}
    } catch (error) {
        console.log(error.messsage);
    }
}
const LoadEditcata = async(req,res)=>{
    try {
        const Id =req.query.id
const Data = await Catagory.findById({_id:Id})
console.log(Data);

    res.render('editcatagory',{info:Data})

        
    } catch (error) {
        console.log(error.message);
    }
}
const LoadUpdatecata = async(req,res)=>{


    try {
        const Id = req.body.id
        const name = req.body.name
        const Data = await Catagory.updateOne({_id:Id},{$set:{catagory:name}})
        if(Data){
            res.redirect('/admin/catagory')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}
const Deletecata = async(req,res)=>{
    try {
        const Id = req.query.id
        const data = await Catagory.findByIdAndDelete({_id:Id})
        await Product.deleteMany({catagory:data.catagory})
        if(data){
            res.redirect('/admin/catagory')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const BlockCategory = async (req,res)=>{
    try {
       const Id = req.query.id
       const category = await Catagory.findById({_id:Id})

       if(category.block==0){
await Catagory.findByIdAndUpdate({_id:Id},{$set:{block:1}})
await Product.updateMany({catagory:category.catagory},{$set:{block:1}})
res.redirect('/admin/catagory')
       }else{
        await Catagory.findByIdAndUpdate({_id:Id},{$set:{block:0}})
await Product.updateMany({catagory:category.catagory},{$set:{block:0}})
res.redirect('/admin/catagory')
       }

    } catch (error) {
        console.log(error.message);
    }
}




const AddProduct = async(req,res)=>{
    try {
        const Data = await Catagory.find()
        res.render('addproduct',{data:Data,msg:' '})
    } catch (error) {
        console.log(error.message);
    }
}
const InsertProduct = async(req,res)=>{
  try {
      if(req.body.name.trim()=='' || req.body.price.trim()==''|| req.body.description.trim()==''){
        const Data = await Catagory.find()
        res.render('addproduct',{msg:'please insert names properly',data:Data})
      }else{

        const img = []
        cloudcdn=[]
        for (let i = 0; i < req.files.length; i++) {
          img[i]= req.files[i].filename
          
await sharp('./public/admin/img2/'+req.files[i].filename)
        .resize(850,850)
        .toFile('./public/admin/img/'+req.files[i].filename);
        const data= await cloudinary.uploader.upload('./public/admin/img/'+req.files[i].filename)
        cloudcdn.push(data.secure_url)
    }
        }
    
    const product = new Product({


        name:req.body.name,
        price:req.body.price,
        image:cloudcdn,
        catagory:req.body.catagory,
        description:req.body.description,
        stock:req.body.stock
    })
    const Data = await product.save()
    if(Data){
        res.redirect('/admin/form')
    }

  } catch (error) {
    console.log(error.message);
  }
}
const DeleteProduct = async(req,res)=>{
    try {
        const Id = req.query.id
        const Data = await Product.findByIdAndDelete({_id:Id})
        if(Data){
            res.redirect('/admin/form')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const LoadEditProduct = async(req,res)=>{
    try {
        const Id = req.query.id
        const Data = await Catagory.find()
        const product = await Product.findById({_id:Id})
        res.render('editproduct',{info:product,data:Data})
    } catch (error) {
        console.log(error.message);
    }
}
const AddEditProduct = async(req,res)=>{
    try {
    if(req.files.length!=0){
    const img = []
    for (let i = 0; i < req.files.length; i++) {
        img[i]= req.files[i].filename
        cloudcdn=[]
await sharp('./public/admin/img2/'+req.files[i].filename)
      .resize(850,850)
      .toFile('./public/admin/img/'+req.files[i].filename);
      const data= await cloudinary.uploader.upload('./public/admin/img/'+req.files[i].filename)
      cloudcdn.push(data.secure_url)
      }

    const Data = await Product.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,catagory:req.body.catagory,price:req.body.price,description:req.body.description,stock:req.body.stock}})
   await Product.findByIdAndUpdate({_id:req.body.id},{ $push: { image: { $each:cloudcdn } } })
    if(Data){
        res.redirect('/admin/form')
    }
    } 
    else{
        const Data = await Product.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,catagory:req.body.catagory,price:req.body.price,description:req.body.description,stock:req.body.stock}})  

    res.redirect('/admin/form')
}
        
    } catch (error) {
        console.log(error.message);
    }
}

const CancelOrder = async(req,res)=>{
    try {

        const Id = req.query.id
        const data = req.query.data
        if(data){
     await Order.findByIdAndUpdate({_id:Id},{$set:{status:'cancelled'}})
        res.redirect('/admin/widget')
    }else{
        await Order.findByIdAndUpdate({_id:Id},{$set:{status:'placed'}})
        res.redirect('/admin/widget')
    }
    } catch (error) {
        console.log(error.message);
    }
}
const OrderStatus = async(req,res)=>{
    try {
      const user = await Users.findOne({_id:req.session.user_id})
      
        const Id =   req.body.id
        const Data = req.body.data
       
        console.log(Id);
console.log(Data);
       
        const update = await Order.findByIdAndUpdate({_id:Id},{$set:{status:Data}})
           
     if(update.status=='Return Approved'||update.status=='Cancelled' ){
       const wallet = update.totalAmount+user.wallet
       await Users.findByIdAndUpdate({_id:req.session.user_id},{$set:{wallet:wallet}})
     }
      if(Data=='Delivered'){

        await Order.findByIdAndUpdate({_id:Id},{$set:{delivery_date:new Date()}})
     }
     res.json({success:true})
    } catch (error) {
        console.log(error.message);
    }
}
const DltImg = async(req,res)=>{
    try {
        const id = req.body.id
        const num = req.body.num
        const product = await Product.findById(id)
        const p = product.image[num]

     const data =    await Product.updateOne({_id:id},{$pullAll:{image:[p]}})
console.log(data);
    } catch (error) {
        
        console.log(error.message);
    }
}
var orderdetails
const SalesReport = async(req,res)=>{
    try {
         orderdetails = await Order.find().populate('products.productId').sort({date:-1})
        
        
         const orders = orderdetails.map(order => ({
            _id: order._id,
            products: order.products.map(product => ({
                name: product.productId.name 
            }))
         }));
         
       
        res.render('salesreport',{order:orderdetails,name:orders,dstart:'',dend:''})
    } catch (error) {
        res.render("404",{msg:error.message})
        console.log(error.message);
    }
}

//   pdf downloading
const puppeteer = require("puppeteer");
const download = async (req, res) => {
    try {
     const order = orderdetails
     let htmlTableData = `
     <style>
    .table td {
      text-align: center;
      padding: 10px;
    }
  </style>
     
     <table class="table">
     <thead>
       <tr>
         <th class="px-4 py-3">NO</th>
         <th class="px-4 py-3">Costomer Name</th>
         <th class="px-4 py-3">Total products</th>
         <th class="px-4 py-3">Products</th>
         <th class="px-4 py-3">Amount</th>
         <th class="px-4 py-3">Method</th>
         <th class="px-4 py-3">Date</th>
       </tr>
     </thead>
     <tbody>`;
 
   for (let i = 0; i < order.length; i++) {
     htmlTableData += `
       <tr>
         <th scope="row">${i + 1}</th>
         <td class="px-4 py-3" >${order[i].user}</td>
         <td  class="px-4 py-3" >${order[i].products.length}</td>
         <td  class="px-4 py-3" >
           ${order[i].products.map(product => product.productId.name).join("<br>")}
         </td>
         <td  class="px-4 py-3" >${order[i].totalAmount}</td>
         <td  class="px-4 py-3" >${order[i].paymentMethod}</td>
         <td  class="px-4 py-3" ><a class="btn btn-danger">${order[i].date.toISOString().substring(0, 10)}</a></td>
       </tr>`;
   }
 
   htmlTableData += `
     </tbody>
   </table>`;
  
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlTableData);
    
        const pdf = await page.pdf();
    
        await browser.close();
    
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment;filename="tableReport.pdf"');
        res.send(pdf);
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Could not generate PDF");
      }
  };


// coupen controlling ...

const LoadCoupen = async(req,res)=>{
    try {
        const data = await Coupen.find()
        res.render('coupen',{data})
    } catch (error) {
        console.log(error.message);
    }
}

const LoadAddcoupen = async(req,res)=>{
    try {

        res.render('addcoupen')
    } catch (error) {
        console.log(error.message);
    }
}

const Addcoupen = async(req,res)=>{
    try {
        const coupen = new Coupen({
            couponcode:req.body.code,
            discount:req.body.discount,
            expiredate:req.body.expdate,
            purchaceamount:req.body.p_amount,
            limit:req.body.limit,
            status:true
        })
        await coupen.save()
        res.redirect("/admin/coupen")
    } catch (error) {
        console.log(error.message);
    }
}

const CoupenDelete = async(req,res)=>{
    try {
        const id = req.body.id
        const method = req.body.method
        if(method=='delete'){
            await Coupen.findByIdAndDelete({_id:id})
        }else{
          
            if(method=='true'){
                await Coupen.findByIdAndUpdate({_id:id},{$set:{status:true}})
            }else{
                await Coupen.findByIdAndUpdate({_id:id},{$set:{status:false}})
            }
           
        }
      
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
    }
}
const LoadEditCoupon = async(req,res)=>{
    try {
        const Id = req.query.id
        const data = await Coupen.findOne({_id:Id})
       
        res.render("editcoupon",{data})
    } catch (error) {
        console.log(error.message);
    }

}

const SalesFilter = async(req,res)=>{
    try {

        const datestart = req.body.start
        const dateend = req.body.end
        orderdetails = await Order.find({
            date: {
              $gte: datestart,
              $lte: dateend
            }
          }).populate('products.productId')

        

        res.render('salesreport',{order:orderdetails,dstart:datestart,dend:dateend})
        
    } catch (error) {
        console.log(error.message);
    }
}
const OrderDetails = async(req,res)=>{
    try {
       
        orderdetails = await Order.find().populate('products.productId').sort({date:-1}).limit(limit)
        const total =  await Order.find()
        const size = Math.ceil(total.length/limit)
        
         const orders = orderdetails.map(order => ({
            _id: order._id,
            products: order.products.map(product => ({
                name: product.productId.name 
            }))
         }));
         
        res.render("orderdetails",{order:orderdetails,name:orders,span_id:'spanid1',size,sdate:'',edate:'',page:1})
    } catch (error) {
        console.log(error.message);
    }
}

const vieworder = async(req,res)=>{
    try {
        const Id = req.query.id
        const orderData=await Order.find({_id:Id}).populate('products.productId')
        console.log(orderData.products);
       
        res.render('vieworder',{orderData})
    } catch (error) {
        console.log(error.message);
    }
}

// Orderpagination of Order

const Orderpagination =async(req,res)=>{
    try {
        const limit = 5
       
        const page = req.query.page
        const span_id = req.query.spanid
        const sdate = req.query.sdate
        const edate=  req.query.edate
        const stx = (page-1)*limit

if(sdate){
    const order = (await Order.find({date:{$gte:sdate,$lte:edate}}).populate('products.productId').sort({date:-1})).length
         const size = Math.ceil(order/limit)
        const orderdetails = await Order.find({date:{$gte:sdate,$lte:edate}}).populate('products.productId').sort({date:-1}).skip(stx).limit(limit)
        const orders = orderdetails.map(order => ({_id: order._id,products: order.products.map(product => ({name: product.productId.name })) }));
        res.render("orderdetails",{order:orderdetails,name:orders,span_id,size,sdate,edate,page})
}else{
    const order = (await Order.find().populate('products.productId').sort({date:-1})).length
         const size = Math.ceil(order/limit)
        const orderdetails = await Order.find().populate('products.productId').sort({date:-1}).skip(stx).limit(limit)
        const orders = orderdetails.map(order => ({
            _id: order._id,products: order.products.map(product => ({name: product.productId.name }))}));
        res.render("orderdetails",{order:orderdetails,name:orders,span_id,size,sdate,edate,page})
 
}


        
       
    } catch (error) {
        console.log(error.message);
    }
}


const filterdetails = async(req,res)=>{
    try {
        const sdate = req.body.start
        const edate=  req.body.end

        orderdetails = await Order.find({date:{$gte:sdate,$lte:edate}}).populate('products.productId').sort({date:-1}).limit(limit)
        const total =  await Order.find({date:{$gte:sdate,$lte:edate}})
        const size = Math.ceil(total.length/limit)
        
         const orders = orderdetails.map(order => ({
            _id: order._id,
            products: order.products.map(product => ({
                name: product.productId.name 
            }))    }));
         
        res.render("orderdetails",{order:orderdetails,name:orders,span_id:'',size,sdate,edate,page:1})
    } catch (error) {
        console.log(error.message);
        res.render('404',{msg:error.message})
    }
}

const filterOrderHistory = async(req,res)=>{
    try {
        const sdate = req.body.start
        const edate = req.body.end
        const orderData = await Order.find({date:{$gte:sdate,$lte:edate}}).sort({date:-1}).limit(limit)

        const total = await (await Order.find({date:{$gte:sdate,$lte:edate}})).length
const size = Math.ceil(total/limit)
        res.render('widget',{data:orderData,span_id:'spanid1',sdate,edate,size,page:1})



    } catch (error) {
        console.log(error.message);
    }
}


module.exports =  {
    Logout,
    LoadDashboard,
    LoadChart,
    LoadForm,
    LoadSignIn,
    LoadUserData,
    VerifySignin,
    LoadWidget,
    BlockUser,
    LoadButton,
    LoadAddCatogory,
    AddCatagory,
    LoadEditcata,
    LoadUpdatecata,
    Deletecata,
    BlockCategory,
    AddProduct,
    InsertProduct,
    DeleteProduct,
    LoadEditProduct,
    AddEditProduct,
    CancelOrder,
    OrderStatus,
    DltImg,
    SalesReport,
    download,
    LoadCoupen,
    LoadAddcoupen,
    Addcoupen,
    CoupenDelete,
    LoadEditCoupon,
    SalesFilter,
    OrderDetails,
    vieworder,
    Orderpagination,
    filterdetails,
    filterOrderHistory

   
}