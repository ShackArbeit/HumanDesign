const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const NoAuthModel = require('../Model/ForNoAuth')
const nodemailer = require('nodemailer');
require('dotenv').config()
const path = require('path');

const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/NoauthSendEmail', async (req, res) => {
  try {
    await connectToDB();   
      // 這裡 CheckUser 是返回剛剛預約資料 Sessions 項目下的所有值
      const CheckUser = await NoAuthModel.distinct('Sessions');
      // 這裡 currentBookingSessions 使用剛剛的 CheckUser 來得到此筆預約資料的所有其他項目值的整個 document 
      const currentBookingSessions=await NoAuthModel.findOne({'Sessions':CheckUser})
      const Year=await currentBookingSessions.Year
      const Month=await currentBookingSessions.Month
      const Day=await currentBookingSessions.Day
      const Hour=await currentBookingSessions.Hour
      const Minute=await currentBookingSessions.Minute
      const BookItem=await currentBookingSessions.BookingItem
      const TimeItem=await currentBookingSessions.TimeItem
      console.log(currentBookingSessions)
      const currentEmail=CheckUser[0].UserEmail
      // 唯有當 document 中 Sessions 裡面有值時才會寄送 Email ，也就是上一筆的寄送的不會重複再寄送
      if (CheckUser !== null && currentBookingSessions.Sessions!==null) {
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
          <p style="font-size: 30px; color: #333;">預約項目為 ${BookItem} & ${TimeItem}</p>
          `,
          attachments: [
            {
              filename: 'test.pdf',
              path: path.join(__dirname, 'test.pdf'),
              contentType: 'application/pdf'
            }
          ]
        };
        transporter.sendMail(mailOptions,async (error, info) => {
          if (error) {
            console.error('郵件發送失敗:', error);
            res.status(500).json({ success: false, message: '郵件發送失敗' });
          } else {
            console.log('郵件已發送:', info.response);
          // 寄出 Email 後就清空該 document 的 Sessions 項目值，確保每一次都是寄送最新一筆的預約資料
            await NoAuthModel.updateOne(
              { Sessions: CheckUser },
              { $set: { Sessions: [] } }
          ).then(() => {
              res.json({ success: true, message: '預約確認郵件已發送' });
          }).catch(updateError => {
              console.error('Error clearing Sessions:', updateError);
              res.status(500).json({ success: false, message: 'Error clearing Sessions' });
     });
          }})
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
