const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const SignUpModel = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');
const nodemailer = require('nodemailer');
require('dotenv').config()

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/resendPassword', async (req, res) => {
    try {
      await connectToDB();
      const { email } = req.body;
      const userEmail = await SignUpModel.find({ Email: email });
      if (userEmail.length > 0) {
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
          to: email,
          subject: '預約確認信',
          html: `<p style="font-size: 20px; color: #333;">你的密碼是 ${userEmail[0].Password}</p>`,
        };
        let responseSent = false; 
        transporter.sendMail(mailOptions, async (error, info) => {
          if (responseSent) return; 
          if (error) {
            console.error('郵件發送失敗:', error);
            responseSent = true;
            res.status(500).json({ success: false, message: '郵件發送失敗' });
          } else {
            console.log('郵件已發送:', info.response);
            responseSent = true;
            res.json({ success: true, message: '預約確認郵件已發送' });
          }
        });
      }
      console.log(userEmail);
    } catch (error) {
      console.log('error', error);
    }
  });

app.use(router);
module.exports = app;
