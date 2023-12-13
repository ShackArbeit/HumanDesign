const mongoose =require('mongoose');
const { Schema,models,model} = mongoose


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

const SignUpModel=models.User||model('User',ParentSchema)

const SignInModel=models.User|| model('User',signInSchema)

module.exports={SignUpModel,SignInModel}