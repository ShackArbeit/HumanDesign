const mongoose =require('mongoose');
const { Schema } = mongoose


// 以下為預約的 Schema
const bookingSchema=new Schema({
    _id:{
        type:Number,
        required:[true,' _id is required']
    },
    Year:{
        type:Number,
        required:[true,'Year is required']
    },
    Month:{
        type:Number,
        required:[true,'Month is required']
    },
    Day:{
        type:Number,
        required:[true,'Day is required']
    },
    Hour:{
        type:Number,
        required:[true,'Hour is required']
    },
    Minute:{
        type:Number,
        required:[true,'Number is required']
    },
    BookingItem:{
        type:String,
        required:[true,'BookingItem is required']
    },
    TimeItem:{
        type:String,
        required:[true,' TimeItem is required']
    }
})


// 以下為註冊的 Schema
const ParentSchema=new Schema({
    Email:{
        type:String,
        required:[true,'Email is required']
    },
    Password:{
        type:String,
        required:[true,'Password is required']
    },
    ConfirmPassword:{
        type:String,
        required:[true,'ConfirmPassword is required']
    },
    // children:[bookingSchema]
})




// 以下為登入的 Schema 
const signInSchema=new Schema({
    Email:{
        type:String,
        required:[true,'Email is required']
    },
    Password:{
        type:String,
        required:[true,'Password is required']
    }
})


module.exports={ParentSchema,signInSchema,bookingSchema}