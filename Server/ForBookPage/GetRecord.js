const router = require('express').Router();
const mongo  = require('mongodb');

const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"
const client = new mongo.MongoClient(url);
let db = null
let id
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



router.get('/fetchData', async (req, res) => {
      try {
        let Email,Password
        if(!id){
          res.json({
            success:false,
            message:'無法找到預約的ID'
          })
        }else{
          const collection = db.collection('AuthForBooking');
          const bookingData = await collection.findOne({
            $and:[
              {Email},
              {Password}
            ]
          });
          console.log(bookingData)
          res.json({
            // success: true,
            // message: 'Booking data retrieved successfully!',
            data: bookingData,
          });
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });


module.exports=router