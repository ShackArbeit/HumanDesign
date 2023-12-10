const router = require('express').Router();
const mongo  = require('mongodb');
const dayjs = require('dayjs');
const {ObjectId}=require('mongodb')

const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"
const client = new mongo.MongoClient(url);
let db = null
let result
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


router.post('/saveDateTimeAndItem', async (req, res) => {
      try {
        const collection= db.collection('AuthForBooking');
        const { selectDateTime,firstValue, secondItem } = req.body;
        const newBooking = new Date(selectDateTime);
       // 將存放的時間點做前後 90 分鐘的區間設定
        const startTime = dayjs(newBooking).subtract(90, 'minutes');
        const endTime = dayjs(newBooking).add(90,'minutes');
      // 先向集合內搜尋存在區間內的所有可能
        const existingReservations = await collection.find({
          $or: [
            {
              $and: [
                { Year: { $eq: newBooking.getFullYear() } },
                { Month: { $eq: newBooking.getMonth() } },
                { Day: { $eq: newBooking.getDate() } },
                { $or: [
                    { $and: [
                        { Hour: { $eq: startTime.hour() } },
                        { Minute: { $gte: startTime.minute() } },
                    ] },
                    { $and: [
                        { Hour: { $eq: endTime.hour() } },
                        { Minute: { $lte: endTime.minute() } },
                    ] },
                    { $and: [
                        { Hour: { $gt: startTime.hour() } },
                        { Hour: { $lt: endTime.hour() } },
                    ] },
                ] },
              ],
            },
          ],
        }).toArray();
        // 若有搜尋到，則將所有符合條件且已存放在 MongoDB 的資料透過解構賦值返回給前端
        if (existingReservations.length > 0) {
          for(i=0;i<existingReservations.length;i++){
            const { Year, Month, Day, Hour, Minute } = existingReservations[i];
            return res.status(400).json({
              success: false,
              message: 'Reservation time is already booked. Please choose another time.',
              Year,
              Month,
              Day,
              Hour,
              Minute
            });
          }
        }
        // 若沒有搜尋到，就額外新增一筆預約資料
        else{
          const year = newBooking.getFullYear();
          const month = newBooking.getMonth();
          const day = newBooking.getDate();
          const hour = newBooking.getHours();
          const minute = newBooking.getMinutes();
         
          result=await collection.insertOne({
              Year: year,
              Month: month,
              Day: day,
              Hour: hour,
              Minute: minute,
              BookingItem:firstValue,
              TimeItem:secondItem,
            });   
            id = result.insertedId;
            // req.session.BookId=result.insertedId
            // console.log(req.session.BookId)
            console.log(id)
          res.json({
            success: true,
            message: 'DateTime inserted successfully!',
            id:id,
            Year: year,
            Month: month,
            Day: day,
            Hour: hour,
            Minute: minute,
            BookingItem:firstValue,
          });
        } 
      } catch (error) {
        console.error('Error inserting DateTime into MongoDB:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
});



router.delete('/deleteFirstBooking',async (req,res)=>{
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: 'No ID provided for deletion' });
    }
    const collection = db.collection('AuthForBooking');
    result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return res.json({ success: true, message: 'Booking deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})
    




module.exports=router