const mongoose =require('mongoose');
const { Schema,models,model} = mongoose


const NoAuthSchema=new Schema({
    Email:{
        type:string,
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
})

const NoAuthModel=models.NoAuthBooking|| model('NoAuthBooking',ParentSchema)


module.exports= NoAuthModel

