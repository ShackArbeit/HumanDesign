const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const SignUpModel = require('../Model/ForAuth');
const BookingModel=require('../Model/ForBooking')
const nodemailer = require('nodemailer');
require('dotenv').config()
const path = require('path');

const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/sendEmail', async (req, res) => {
  try {
    await connectToDB();
   
      const currentUser = await SignUpModel.distinct('Sessions');
      // 這裡 CheckBookingSession 是返回剛剛預約資料內的 Sessions 項目的各項值
      const CheckBookingSession=await BookingModel.distinct('Sessions')
      // 這裡  currentBookingSession 是使用剛剛的 Sessions 來查詢該筆所返回預約資料
      const currentBookingSession=await BookingModel.findOne({Sessions:CheckBookingSession})
      const Year = await currentBookingSession.Year;
      const Month = await currentBookingSession.Month;
      const Day = await currentBookingSession.Day;
      const Hour = await currentBookingSession.Hour;
      const Minute = await currentBookingSession.Minute
      const BookingItem = await currentBookingSession.BookingItem;
      const TimeItem = await currentBookingSession.TimeItem
      // 之前當 Sessions 裡面不是空值時才會寄送 Email 
      if (currentUser !== null && currentBookingSession.Sessions!==null) {
        const currentEmail = currentUser[0].user.Email;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'g0972222165@gmail.com',
            pass: 'zttn zhgf cqdh dpoy'
          }
        });
        const mailOptions = {
          from: 'g0972222165@gmail.com',
          to: currentEmail,
          subject: '預約確認信',
          html: `
            <p style="font-size: 40px; color: #333;">感謝你的預約</p>
            <p style="font-size: 30px; color: #333;">你所預約的日期為 ${Year}.${Number(Month)+1}.${Day}</p>
            <p style="font-size: 30px; color: #333;">時間為: ${Hour} 時 ${Minute} 分</p>
            <p style="font-size: 30px; color: #333;">預約項目為 ${BookingItem} & ${TimeItem}</p>
          `,
          attachments: [
            {
              filename: 'test.pdf',
              path: path.join(__dirname, 'test.pdf'),
              contentType: 'application/pdf'
            }
          ]
        };
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.error('郵件發送失敗:', error);
            res.status(500).json({ success: false, message: '郵件發送失敗' });
          } else {
            console.log('郵件已發送:', info.response);
        // 寄送 Email 後清除 Sessions 為空陣列，確保每一次寄送 Emial 都是當前預約的值
            currentBookingSession.Sessions=[];
            await currentBookingSession.save();
            res.json({ success: true, message: '預約確認郵件已發送' });
          }
        });
      } else {
        res.json({
          'State': '這位使用者前還沒有登入'
        });
      }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
