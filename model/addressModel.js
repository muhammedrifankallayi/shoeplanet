const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')



const addressschema = new mongoose.Schema({
    user_id:{
        type:ObjectId,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    adress:[
        {
          fname:{
            type:String,
            required:true
          },
          lname:{
            type:String,
            required:true
          },
          country:{
            type:String,
            required:true
          },
          state:{
            type:String,
            required:true
          } ,
          city:{
            type:String,
            required:true
          } ,
          pincode:{
            type:Number,
            required:true
          },
          adress:{
            type:String,
            required:true
          },
          email:{
            type:String,
            required:true
          },
          mobile:{
            type:Number,
            required:true

          },
          place:{
            type:String,
            required:true
          }
        }
    ]

})
module.exports= mongoose.model('User_adress',addressschema)