const router = require('express').Router();
const connectToDB=require('../ConnectToMongoDB')
const mongoose=require('mongoose')
const {signInSchema}=require('../AuthSchema')
const signInModel = mongoose.models.AuthForBooking || mongoose.model('AuthForBooking', signInSchema);



router.post('/directSignIn',async(req,res)=>{
      try{
        await connectToDB()
        const{email,password}=req.body
        const checkIfAuth=signInModel.findOne({
          $and: [
            { Email: email },
            { Password: password }
          ]
        })

        if(checkIfAuth===null){
          res.json({
            success: false,
            message: '登入失敗，Email 或 Password 有錯誤',
          });
        }else{
          res.json({
            success: true,
            message: '登入成功 !',
            Email:email,
            Password:password
          });
        }
       }catch(error){
        console.log('登入過程中發生錯誤', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
       }
      })




module.exports=router