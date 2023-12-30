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
      
      const currentUser = await NoAuthModel.distinct('Sessions');
      console.log(currentUser);
      const currentEmail=currentUser[0].UserEmail
      console.log(currentEmail)
      if (currentUser !== null) {
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
          text: '感謝您的預約！預約詳情等內容',
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
            await NoAuthModel.updateOne(
              { Sessions: currentUser },
              { $set: { Sessions: [] } }
          ).then(() => {
              res.json({ success: true, message: '預約確認郵件已發送' });
          }).catch(updateError => {
              console.error('Error clearing Sessions:', updateError);
              res.status(500).json({ success: false, message: 'Error clearing Sessions' });
     });
          //   res.json({ success: true, message: '預約確認郵件已發送' });
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
