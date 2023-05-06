const mongoose = require('mongoose')

const productschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image: {
        type: Array
      },
    catagory:{
       
            type:String,
            required:true
        
    },
    description:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    block:{
        type:Number,
        default:0
    }
})
module.exports= mongoose.model('Product',productschema)