const dayjs = require('dayjs');
const connectToDB=require('../Databse/ConnectToMongoDB')
const BookingModel=require('../Model/ForBooking')
const {SignUpModel} = require('../Model/ForAuth');
const express = require('express');
const app = express();
const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);


const router = require('express').Router();


router.post('/saveDateTimeAndItem', async (req, res) => {
      try {
        await connectToDB()
        const checkLogIn=req.sessionID
        const SeesionForAuth=await SignUpModel.findOne({sessionId:checkLogIn})
        console.log(SeesionForAuth.sessions[0].sessionID)
        if(SeesionForAuth.sessions[0].sessionID){
          const { selectDateTime,firstValue, secondItem } = req.body;
          // 從 SignUpModel 中抓取 _id 項
          const user = await SignUpModel.findOne({});
          const BookingPerson = user._id;
          const newBooking = new Date(selectDateTime);
         // 將存放的時間點做前後 90 分鐘的區間設定
          const startTime = dayjs(newBooking).subtract(90, 'minutes');
          const endTime = dayjs(newBooking).add(90,'minutes');
        // 先向集合內搜尋存在區間內的所有可能
        console.log(BookingModel)
        console.log(newBooking)
        const existingReservations=await BookingModel.find({
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
         }).exec();
        console.log(existingReservations)
        console.log(firstValue)
        console.log(secondItem)
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

            const newBookings=new BookingModel({
              BookingPerson,
              Year: year,
              Month: month,
              Day: day,
              Hour: hour,
              Minute: minute,
              BookingItem:firstValue,
              TimeItem:secondItem
            })
            await newBookings.save()
            res.json({
              success: true,
              message: 'DateTime inserted successfully!',
              Year: year,
              Month: month,
              Day: day,
              Hour: hour,
              Minute: minute,
              BookingItem:firstValue,
            });
          } 
        }else{
          console.log('你並非該使用者，所以無法預約諮詢')
          res.status(500).json({ success: false, message: '你並非該使用者，所以無法預約諮詢' });
        }   
      } catch (error) {
        console.error('Error inserting DateTime into MongoDB:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
});



router.delete('/deleteFirstBooking',async (req,res)=>{
  try {
     await connectToDB()
     const checkLogIn=req.sessionID
     const SeesionForAuth=await SignUpModel.findOne({sessionId:checkLogIn})
     console.log(SeesionForAuth.sessions[0].sessionID)
     if(SeesionForAuth.sessions[0].sessionID){
      const BookingData=await BookingModel.findOne({})
      BookingId=BookingData._id
      if(!BookingId){
        return res.status(400).json({ success: false, message: 'No ID provided for deletion' });
      }
      const result = await BookingModel.deleteOne({});
      if (result.deletedCount === 1) {
        return res.json({ success: true, message: 'Booking deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
     }else{
      console.log('並非該使用者，無法被刪除')
      return res.status(404).json({ success: false, message: '並非該使用者，無法被刪除' });
     }
    
   } catch (error) {
     console.error('Error deleting booking:', error);
     res.status(500).json({ success: false, message: 'Internal server error' });
   }
 })
    




module.exports=router