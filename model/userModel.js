const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        required:true
    },
     password:{
        type:String,
        required:true
    },
    is_admin:{
        type:String,
        required:true
    },
    is_verified:{
        type:String,
        default:0
    },
    wallet:{
        type:Number,
        default:0
    },
    image:{
        type:String,
       
    }
});
module.exports = mongoose.model('Users',userSchema);