const mongoose = require('mongoose')

const ordershema = new  mongoose.Schema({

user:{
    type:String,
    require:true
},
user_id:{
    type:String,
    require:true
},
deliveryDetails:{
    type:String,
    require:true
},
email:{
    type:String,
    required:true
},
mobile:{
    type:Number,
    required:true
},
paymentMethod:{
    type:String,
    require:true
},
products:[
    {
        productId:{
            type:String,
            ref:'Product',
            require:true
        },
        count:{
            type:Number,
            require:true
        },
        shoeSize:{
            type:Number
        }
       

    }
],
totalAmount:{
    type:Number
   
},
date:{
    type:Date
  
},
status:{
    type:String

},
payment_id:{
    type:String
},


delivery_date:{
    type:Date,
    
}
}
)
module.exports=mongoose.model('Orders',ordershema)