const Cart = require('../model/cartModel')
const Products = require('../model/productModel')
const Users = require('../model/userModel')
const Adress =require('../model/addressModel')
const Order = require('../model/orderModel')
const Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_EPM97YtygusiKT',
    key_secret: 'yahzAX4mg8BSZSLO1RB7ubDQ',
  });

var CPRODUT  
var TOTAL  

var date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`


    const addToCart=async(req,res)=>{
        try {
            const productid=req.body.product_id
            const productData=await Products.findOne({_id:productid})
            const userData=await Users.findOne({_id:req.session.user_id})
            if(req.session.user_id){
                const userid=req.session.user_id;
                const cartData=await Cart.findOne({userId:userid})
                if(cartData){
                    const productExist= cartData.products.findIndex((product)=>product.productId==productid)
                    if(productExist != -1){
                        await Cart.updateOne({userId:userid,"products.productId":productid},{$inc:{"products.$.count":1}})
                        res.json({success:true})
                       
                            // res.redirect('/women')
                       
                        
                    }else{
                        await Cart.findOneAndUpdate({userId:req.session.user_id},{$push:{products:{productId:productid,productPrice:productData.price}}})
                       res.json({success:true})
                      
                        // res.redirect('/women')
                  
                    }
                }else{
                  const cart= new Cart({
                        userId:userData._id,  //removed username
                        products:[{
                            productId:productid,
                            productPrice:productData.price,
                           
                        }]
                    })
                    const cartDatas=await cart.save()
                    if(cartDatas){
                         res.json({success:true})
                       
                            // res.redirect('/women')
                      
                            
                        
                       
                    }else{
                        res.redirect('/women')
                    }
                }
            }else{
                res.redirect('/login')
            }
        } catch (error){
            console.log(error.message);
           
        }
    }
    const LoadCart=async(req,res)=>{
        try {
        //    const id=req.session.userId;
           const session=req.session.user_id;
           const userdata=await Users.findOne({_id:session})
        //    const userName= await user.findOne({_id:session})
           const cartData=await Cart.findOne({userId:session}).populate('products.productId')
           if(req.session.user_id){
           if(cartData){
            if(cartData.products.length>0){
                const products=cartData.products
                const total=await Cart.aggregate([{$match:{userId:session}},{$unwind:'$products'},{$project:{productPrice:'$products.productPrice',cou:'$products.count'}},{$group:{_id:null,total:{$sum:{$multiply:['$productPrice','$cou']}}}}])
                const Total =total[0].total;
                
                const userId=userdata._id
                let customer=true
                const STD=45
              CPRODUT=products
              TOTAL=Total

                res.render('cart',{customer,userdata,products,Total,userId,session,userdata,STD})
            }else{
        let customer=true;
        res.render('cartEmpty',{customer,userdata,session,msg:'No product added to cart'})
    }
           }else{
            let customer=true
            res.render('cartEmpty',{customer,userdata,session,msg:'No product added to cart'})
           }
        }else{
            res.redirect('/register')
        }
        } catch (error) {
            console.log(error.message)
        }
    }

    const cartprDlt=async(req,res)=>{
        try {
           console.log(req.query.proId);
            const Id=req.session.user_id

            const remove=await Cart.updateOne({userId:Id},{$pull:{products:{productId:req.query.proId}}})
            console.log(remove)
            if(remove){
                res.redirect('/cart')
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    const changeCount=async(req,res)=>{
        try {
            
            const userid=req.session.user_id
            
            
            var num=req.body.q
             
            if(num>1){
               
              const cartData= await Cart.updateOne({userId:userid,"products._id":req.body.id},{$inc:{"products.$.count":req.body.count}})

              const updatedCartData = await Cart.findOne({ userId: userid, "products._id": req.body.id });

              // Access the count field of the updated product
              const updatedCount = updatedCartData.products.find(p => p._id == req.body.id).count;
              
           
              if(cartData){
                res.json({count:updatedCount})
              }
            }
        } catch (error) {
            console.log(error.message)
        }  
    }

    const LoadCheckout = async(req, res) => {
        try {
           var is_wallet
            const adress = await Adress.findOne({user_id:req.session.user_id})
          const wallet = await Users.findOne({_id:req.session.user_id})

             if(adress){
                res.render('checkout',{products:CPRODUT,total:TOTAL,data:adress,wallet,is_wallet})
             }else{
                res.redirect('/newadress')
             }
           
        } catch (error) {
            console.log(error.message);
        }
    }
    // To Show Adress page

const newadress= async(req,res)=>{
    try {
        const profile = req.query.profile
        res.render('adress',{profile})
    } catch (error) {
        console.log(error.message);
    }
}



 const CartData =  async(req,res)=>{
    try {

      res.redirect('/checkout')
    } catch (error) {
        console.log(error.message);
    }
 }
    
//  to add new addrrss.............
 const UserAdress = async(req,res)=>{
    try {
        const is_profile = parseInt(req.body.profile)
const adressData = await Adress.findOne({user_id:req.session.user_id})

if(adressData){
    await Adress.updateOne({user_id:req.session.user_id},{$push:{adress:{fname:req.body.fname,
        lname:req.body.lname,
        country:req.body.country,
        state:req.body.state,
        adress:req.body.adress,
        email:req.body.email,
        pincode:req.body.pincode,
        mobile:req.body.mobile,
        city:req.body.city,
        place:req.body.village}}})
        console.log(req.body.profile);
if(is_profile === 1 ){
    res.redirect('/profile')
}else{
    res.redirect('/checkout')
}

    }else{

const user = await Users.findById({_id:req.session.user_id})
        const adress = new Adress({
            user_id:req.session.user_id,
            username:user.username,
            adress:[{
                fname:req.body.fname,
                lname:req.body.lname,
                country:req.body.country,
                state:req.body.state,
                adress:req.body.adress,
                email:req.body.email,
                pincode:req.body.pincode,
                mobile:req.body.mobile,
                city:req.body.city,
                place:req.body.village
            }
            ]
            
        })
        const data = await adress.save()

        if(data){
            if(req.body.profile== 1 || '1'){
                res.redirect('/profile')
            }else{
                res.redirect('/checkout')
            }
        }
    }
        
    } catch (error) {
        console.log(error.message);
    }
 }


// to edit a adrress..............
const DeleteAddress = async(req,res)=>{
    try {
        const id = req.query.id
        const AdrressData = await Adress.findOne({user_id:req.session.user_id})
        const position = AdrressData.adress[id]
        await Adress.findOneAndUpdate({user_id:req.session.user_id},{$pull:{adress:{_id:position}}})
        if(req.query.profile){
            res.redirect("/profile")
        }else{
            res.redirect('/checkout')
        }

    } catch (error) {
        console.log(error.message);
    }
}
// edit page rendering
const EditAddress = async(req,res)=>{
    try {

        const index  = req.query.id
const Adrs = await Adress.findOne({user_id:req.session.user_id})
const data = Adrs.adress[index]
res.render('editaddress',{data,index})
    } catch (error) {
        console.log(error.message);
    }
}
// updating  address
const UpdateAddress  = async(req,res)=>{
    try {
        const index = req.body.index
        console.log(index);
        const Data  =await Adress.updateOne({user_id:req.session.user_id},{$set:{[`adress.${index}`]:{
            fname:req.body.fname,
                lname:req.body.lname,
                country:req.body.country,
                state:req.body.state,
                adress:req.body.adress,
                email:req.body.email,
                pincode:req.body.pincode,
                mobile:req.body.mobile,
                city:req.body.city,
                place:req.body.village
        }}})
        if(req.query.profile){
            res.redirect('/profile')
    }
    else
    {
        res.redirect('/checkout')
    }
        
        
    console.log(Data);
    } catch (error) {
        console.log(error.message);
    }
}




var amount
var Nwallet
 const placeOrder = async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.session.user_id });
        const session=req.session.user_id
        const total=await Cart.aggregate([{$match:{userId: req.session.user_id}},{$unwind:'$products'},{$project:{productPrice:'$products.productPrice',cou:'$products.count'}},{$group:{_id:null,total:{$sum:{$multiply:['$productPrice','$cou']}}}}])
                const Total =total[0].total;

    
     amount = parseInt(req.body.amount)
      

        const payment = req.body.optradio;
        const address=req.body.adress
        
        const cartData = await Cart.findOne({ userId: req.session.user_id });
        
        const products = cartData.products;
      
        const status = payment === "COD" ? "placed" : "pending";

        const newOrder = new Order({
            deliveryDetails:address,
            user: userData.username,
            user_id:req.session.user_id,
            paymentMethod: payment,
            products: products,
            totalAmount: amount,
            date: new Date(),
            status: status
        });

       const orderData= await newOrder.save();
     

        if (status === "placed") {
            await Cart.deleteOne({ userId: session });
            console.log('COD oreder successful');
           res.json({success:true})
        } else {
            const orderid=orderData._id
            console.log('hai1');
            if(req.body.wallet && amount>userData.wallet){
                console.log('hai2')
                amount = amount-userData.wallet
               Nwallet = 0
               }else if(req.body.wallet && amount<userData.wallet){
                console.log('hai3');
                
                console.log(amount);
                Nwallet = userData.wallet-amount
                amount = 0
               
               }
               if(amount>0){
                const totalamount=orderData.totalAmount
                var options={
                        amount:amount*100,
                        currency: "INR",
                        receipt: ""+orderid
                }
           
                instance.orders.create(options,function(err,order){
                    res.json({order});
                })
               }else{
                await Cart.deleteOne({ userId: session });
                console.log('COD oreder successful');
               res.json({success:true})
               }
           
         
        }
    } catch (error) {
        console.log(error.message);
    }
}

const LoadMyorders = async(req,res)=>{
    try {
        const orderData=await Order.find({user_id:req.session.user_id}).populate('products.productId') 
res.render('myorders',{orderData})

    } catch (error) {
        console.log(error.message);
    }
}

const OrderView = async(req,res)=>{
    try {
        const Id = req.query.id
        const orderData=await Order.find({_id:Id}).populate('products.productId')
        console.log(orderData.products);
        res.render('orderview',{orderData})
    } catch (error) {
        console.log(error.message);
    }
}
const RemoveOrder = async(req,res)=>{
    try {
        const Id = req.body.id
        const proid= req.body.index
        

const data = await Order.findById({_id:Id})
const p = data.products[proid]
        const rd =await Order.updateOne({_id:Id},{$pullAll:{products:[p]}})
        const Ndata = await Order.findById({_id:Id})
        if(Ndata.products.length<1){
            await Order.findByIdAndDelete({_id:Id})
            res.json({successall:true})
        }else{
            res.json({success:true})
        }
       
       
    } catch (error) {
        console.log(error.message);
    }
}

const verifyOnlinePayment =async(req,res)=>{
    try {
        
        const details= (req.body)
        console.log(details);
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', 'yahzAX4mg8BSZSLO1RB7ubDQ');

        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id)  
            
        hmac = hmac.digest('hex');
      

        console.log(details.payment.razorpay_signature);
        
        if (hmac == details.payment.razorpay_signature) {

          

            await Order.findByIdAndUpdate({_id:details.order.receipt},{$set:{status:"placed"}});
            await Order.findByIdAndUpdate({_id:details.order.receipt},{$set:{payment_id:details.payment.razorpay_payment_id}});
            await Cart.deleteOne({userId:req.session.user_id});
            await Users.findByIdAndUpdate({_id: req.session.user_id},{$set:{wallet:Nwallet}})
            res.json({success:true});
            console.log('online pay oreder successful');
        }else{
            await Order.findByIdAndRemove({_id:details.order.receipt});
            res.json({success:false});
        }
        

    } catch (error) {
        console.log(error.message);
        
    }
}
const CancelOrder = async(req,res)=>{
    try {
       const id = req.body.id
       const status = req.body.status 
       console.log(status);
       const Data  = await Order.findByIdAndUpdate({_id:id},{$set:{status:status}})
       const userorder = await Order.findOne({_id:id})
       console.log('hai');
       if(userorder.status =='Cancelled'){
        console.log('hai');
        if(userorder.paymentMethod !="COD"){
            const wallet = await Users.findOne({_id:req.session.user_id})
            console.log('hau');
            console.log(wallet+"wallet");
            const amount =wallet.wallet+userorder.totalAmount
            console.log(amount+"amount");
           await Users.findByIdAndUpdate({_id:req.session.user_id},{$set:{wallet:amount}})
        }
       
       
       }
      
       res.json({success:true})
    } catch (error) {
        console.log(error.message);
    }

}





    module.exports={
        LoadCart,
       addToCart,
       changeCount,
       cartprDlt,
       CartData,
       newadress,
       UserAdress,
       EditAddress,
       DeleteAddress,
       LoadCheckout,
      placeOrder,
      LoadMyorders,
      OrderView,
      RemoveOrder,
      verifyOnlinePayment,
      UpdateAddress,
      CancelOrder
    }