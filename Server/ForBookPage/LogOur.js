const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const  SignUpModel  = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');


app.use(sessionMiddleware);


const router = require('express').Router();

router.post('/logout',async (req,res)=>{
    try{
        const SeesionForAuth=await SignUpModel.distinct('Sessions')
        console.log(SeesionForAuth[0].sessionID)
        if(SeesionForAuth[0].sessionID){
            const User = await SignUpModel.findOne({ 'Sessions.sessionID': SeesionForAuth[0].sessionID });
            if(User){
                User.logout();
                await User.save();
                res.json({
                    success: true,
                    message: '登出成功!',
                  });
            }
        } else {
          res.json({
            success: false,
            message: '找不到使用者，可能已經登出或帳號不存在',
          });
        }
    }catch(e){
        console.log(e)
    }
})
