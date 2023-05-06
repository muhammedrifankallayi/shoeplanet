const mongoose = require('mongoose')

const CatagorySchema = new mongoose.Schema({

    catagory:{
        type:String,
        required:true
    },
    block:{
type:Number,
default:0
    }

})
module.exports=mongoose.model('Catagory',CatagorySchema)