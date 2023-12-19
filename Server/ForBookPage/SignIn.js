const express = require('express');
const app = express();
const connectToDB=require('../Databse/ConnectToMongoDB')
const {SignInModel}=require('../Model/ForAuth')
const { SignUpModel } = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/directSignIn',async(req,res)=>{
      try{
        await connectToDB()
        const checkLogIn=req.sessionID
        const SeesionForAuth=await SignUpModel.findOne({sessionId:checkLogIn})
        console.log(SeesionForAuth.sessions[0].sessionID)
        
        if(SeesionForAuth.sessions[0].sessionID){
          const{email,password}=req.body
          const checkIfAuth=SignInModel.findOne({
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
         }
         else{
            console.log('你並非剛剛註冊的人!')
            res.status(500).json({ success: false, message: '儲存的註冊狀態有問題' });
         }
        }catch(error){
          console.log('登入過程中發生錯誤', error);
          res.status(500).json({ success: false, message: 'Internal server error' });
         }
       
      })

module.exports=router