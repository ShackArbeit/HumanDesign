const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const NoAuthModel=require('../Model/ForNoAuth')

const AuthsessionMiddleware=require('../Databse/NoAuthSession')

app.use(AuthsessionMiddleware);


const router = require('express').Router();


router.post('/noAuthBooking',async(req,res)=>{
        try{
            await connectToDB()
            
        }catch(error){
            console.log(error)
        }
})




app.use(router);

module.exports = app;
