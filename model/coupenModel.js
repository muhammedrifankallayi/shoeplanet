const mongoose = require('mongoose')

const couponschema= new mongoose.Schema({

    couponcode:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    expiredate:{
        type:Date,
        required:true       
    },
    user:{
        type:Array,
        default:[]
    },
    purchaceamount:{
        type:Number,
        required:true
    },
    limit:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
   is_placed:{
        type:Boolean,
        default:false
        
    }
})
module.exports= mongoose.model('Coupon',couponschema)