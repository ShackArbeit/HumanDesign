const express = require('express');
const app = express();
const BookingModel=require('../Model/ForBooking')

const sessionMiddleware=require('../Databse/Session')

app.use(sessionMiddleware)

const router = require('express').Router();

router.get('/checkBooking',(req,res)=>{
    console.log(BookingModel);
    res.json({
        "City":"Taipei",
        "Name":"Shack",
        "Age":"33",
    })
})


module.exports=router