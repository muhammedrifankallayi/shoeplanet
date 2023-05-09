const mongoose = require('mongoose');


const Walletschema = new mongoose.Schema({
userId:{
type:String,
required:true
},
    withdraw:{
        type:Number,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    is_add:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        required:true
    }

})

module.exports = mongoose.model("wallet_history",Walletschema)