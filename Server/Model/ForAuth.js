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
    Sessions: [
        {
          sessionID: String,
          cookie: Object, 
          user: Object, 
        }
      ],
})

const SignUpModel=models.User||model('User',ParentSchema)


module.exports=SignUpModel