const Users = require('../model/userModel')
const islogin = async(req,res,next)=>{


    try {
     if(req.session.user_id){
        const user = await Users.findOne({_id:req.session.user_id})
        if(user.is_verified==1){
            next()
        }else{
            res.redirect('/login')
        }
     }else{
         res.redirect('/login')
     }
    } catch (error) {
     console.log(error.message)
    }
 }
 const islogout = async(req,res,next)=>{
     try {
      if(req.session.user_id ){
        const user = await Users.findOne({_id:req.session.user_id})
        if(user.is_verified==1){
            res.redirect('/index')
        }else{
            next()
        }
         
          
      }else{
        next()
      }
     
     
     
     } catch (error) {
      console.log(error.message)
     }
  
  }
 const isadnlogin = async(req,res,next)=>{

    try {
        if(req.session.userid){
          
        }else{
          
            res.redirect('/admin/')
        }
       
        next()
       } catch (error) {
        console.log(error.message)
       }


 }

const isadnlogout = async(req,res,next)=>{
    try {
        try {
            if(req.session.userid ){
                res.redirect('/admin/index')
              
            }
           
       
            next()
           } catch (error) {
            console.log(error.message)
           }
    } catch (error) {
        console.log(error.messsage);
    }
}




  module.exports = {
     islogin,
     islogout,
     isadnlogin,
     isadnlogout
  }