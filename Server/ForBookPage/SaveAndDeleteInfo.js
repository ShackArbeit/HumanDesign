const dayjs = require('dayjs');
const connectToDB=require('../Databse/ConnectToMongoDB')
const BookingModel=require('../Model/ForBooking')
const SignUpModel = require('../Model/ForAuth');
// const { ObjectId } = require('mongoose').Types;
const express = require('express');
const app = express();
const sessionMiddleware = require('../Databse/Session');
// const { v4: uuidv4 } = require('uuid');

app.use(sessionMiddleware);

let year,month,day,minute,hour

const router = require('express').Router();



router.post('/saveDateTimeAndItem', async (req, res) => {
      try {
        await connectToDB()  
           const SeesionForAuth=await SignUpModel.distinct('Sessions')
           console.log(SeesionForAuth[0].sessionID)
           const User = await SignUpModel.findOne({ 'Sessions.sessionID': SeesionForAuth[0].sessionID });
            if(User){
              const UserId=User._id
              const { selectDateTime,firstValue, secondItem } = req.body;
              const BookingPerson = UserId
              const newBooking = new Date(selectDateTime);
             // 將存放的時間點做前後 90 分鐘的區間設定
              const startTime = dayjs(newBooking).subtract(90, 'minutes');
              const endTime = dayjs(newBooking).add(90,'minutes');
            // 先向集合內搜尋存在區間內的所有可能
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
                 year = newBooking.getFullYear();
                 month = newBooking.getMonth();
                 day = newBooking.getDate();
                 hour = newBooking.getHours();
                 minute = newBooking.getMinutes();
    
                const newBookings=new BookingModel({
                  // BookingNumber:uuidv4(),
                  BookingPerson,
                  Year: year,
                  Month: month,
                  Day: day,
                  Hour: hour,
                  Minute: minute,
                  BookingItem:firstValue,
                  TimeItem:secondItem
                })
                BookingNumber = newBookings.BookingNumber;
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
            }
      } catch (error) {
        console.error('Error inserting DateTime into MongoDB:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
});



router.delete('/deleteFirstBooking',async (req,res)=>{
  try {
     await connectToDB()
     console.log({year,month,day,hour,minute})
    const BookingData = await BookingModel.findOne(
     {Year:year,Month:month,Day:day,Hour:hour,Minute:minute});
    
    console.log(BookingData);
      BookingId=BookingData._id
       console.log(BookingId)
      if(!BookingId){
        return res.status(400).json({ success: false, message: 'No ID provided for deletion' });
      }
      const result = await BookingModel.deleteOne({ _id: BookingId });
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