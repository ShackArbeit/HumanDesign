const mongoose =require('mongoose');
const { Schema } = mongoose

const signUpSchema=new Schema({
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
    }
})

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


module.exports={signUpSchema,signInSchema}