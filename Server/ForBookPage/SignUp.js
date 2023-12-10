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

router.post('/signUp',async(req,res)=>{
      try{
          const collection=db.collection('AuthForBooking')
          const{email,password,confirmPassword}=req.body;
    
          let checkEmail=await collection.findOne({
            Email:email
          })
          if(checkEmail!==null){
            res.json({
              success: false,
              message: '註冊失敗，因為信箱重複',
            });
          }else{
            result=collection.insertOne({
              Email:email,
              Password:password,
              confirmPassword:confirmPassword
            })
            res.json({
              success: true,
              message: '已經收到你的信箱及密碼了!',
              Email:email,
              Password: password,
              ConfirmPassword:confirmPassword
            });
          }   
      }catch(error){
        console.log('無法儲存你的資料',error)
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
})
module.exports=router