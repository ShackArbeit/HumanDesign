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
      const Year = await BookingModel.distinct('Year');
      const Month = await BookingModel.distinct('Month');
      const Day = await BookingModel.distinct('Day');
      const Hour = await BookingModel.distinct('Hour');
      const Minute = await BookingModel.distinct('Minute');
      const BookingItem = await BookingModel.distinct('BookingItem');
      const TimeItem = await BookingModel.distinct('TimeItem');
      console.log(currentUser);
      console.log({Year,Month,Day,Hour,Minute,BookingItem,TimeItem})

      if (currentUser !== null) {
        const currentEmail = currentUser[0].user.Email;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
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
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('郵件發送失敗:', error);
            res.status(500).json({ success: false, message: '郵件發送失敗' });
          } else {
            console.log('郵件已發送:', info.response);
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
