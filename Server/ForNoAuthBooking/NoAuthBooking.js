const express = require('express');
const dayjs = require('dayjs');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const NoAuthModel=require('../Model/ForNoAuth')
const BookingModel=require('../Model/ForBooking')

const AuthsessionMiddleware=require('../Databse/NoAuthSession')

app.use(AuthsessionMiddleware);


const router = require('express').Router();


router.post('/noAuthBooking',async(req,res)=>{
        try{
            await connectToDB()
            const { selectDateTime,firstValue, secondItem,email } = req.body;
            console.log({ selectDateTime,firstValue, secondItem,email })
            const newBooking = new Date(selectDateTime);
            // 將存放的時間點做前後 90 分鐘的區間設定
             const startTime = dayjs(newBooking).subtract(90, 'minutes');
             const endTime = dayjs(newBooking).add(90,'minutes');
           // 先向集合內搜尋存在區間內的所有可能
           console.log(newBooking)
           const existingReservationsBookingModel = await BookingModel.find({
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
            ]
           })
           const existingReservationsNoAuthModel = await NoAuthModel.find({
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
           })
           const existingReservations = existingReservationsBookingModel.concat(existingReservationsNoAuthModel);
           console.log(existingReservations)
           console.log(firstValue)
           console.log(secondItem)
            // 若有搜尋到，則將所有符合條件且已存放在 MongoDB 的資料透過解構賦值返回給前端
              if (existingReservations && existingReservations.length > 0) {
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
   
               const newBookings=new NoAuthModel({
                 Email:email,
                 Year: year,
                 Month: month,
                 Day: day,
                 Hour: hour,
                 Minute: minute,
                 BookingItem:firstValue,
                 TimeItem:secondItem,
                 Sessions:[{
                   UserEmail:email,
                   sessionID: req.sessionID,
                   cookie: req.session.cookie
                 }]
               })
               await newBookings.save()
               res.json({
                 success: true,
                 message: 'DateTime inserted successfully!',
                 id:newBookings._id,
                 Email:email,
                 Year: year,
                 Month: month,
                 Day: day,
                 Hour: hour,
                 Minute: minute,
                 BookingItem:firstValue,
               });
            }
        }catch(error){
            console.error('Error inserting DateTime into MongoDB:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
})




app.use(router);

module.exports = app;
