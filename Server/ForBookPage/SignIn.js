const router = require('express').Router();
const mongo  = require('mongodb');


const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"
const client = new mongo.MongoClient(url);
let db = null

async function initDB() {
      try {
            await client.connect()
            console.log('連線成功')
            db = client.db("myWebsite");
  
      } catch (err) {
            console.log('連線失敗', err)
            return
      }
}
initDB()




router.post('/directSignIn',async(req,res)=>{
      try{
        const collection=db.collection('AuthForBooking')
        const{email,password}=req.body
        const checkIfAuth=await collection.findOne({
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
       }catch(error){
        console.log('登入過程中發生錯誤', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
       }
      })




module.exports=router