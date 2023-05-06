const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'Users',
        required:true
    },
    products:[{
        productId:{
            type:String,
            ref:'Product',
            required:true
        },
        count:{
            type:Number,
            default:1
        },
        productPrice:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number,
            default:0
        },
        wallet:{
            type:Number,
            default:0
        }
    }]
})
module.exports=mongoose.model('cart',cartSchema)

