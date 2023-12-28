const mongoose =require('mongoose');
const { Schema,models,model} = mongoose


const NoAuthSchema=new Schema({
    Email:{
        type:String,
        required:[true,'Email is required']
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
    },
    Sessions:[]
})

const NoAuthModel=models.NoAuthBooking|| model('NoAuthBooking',NoAuthSchema)


module.exports= NoAuthModel

