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
}


}
)
module.exports=mongoose.model('Orders',ordershema)