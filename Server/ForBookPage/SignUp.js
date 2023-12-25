const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const SignUpModel = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/signUp', async (req, res) => {
  try {
    await connectToDB();
    const { email, password, confirmPassword } = req.body;
    const checkEmail = await SignUpModel.findOne({ Email: email });
    if (checkEmail !== null) {
      res.json({
        success: false,
        message: '註冊失敗，因為信箱重複',
      });
    } else {
    // 這裡沒有建立 Sessions 物件，而是等到登入時才會建立
      const newUser = new SignUpModel({
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
      });
      await newUser.save();
      res.json({
        success: true,
        message: '已經收到你的信箱及密碼了!',
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword
      });
    }
  } catch (error) {
    console.log('無法儲存你的資料', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.use(router);

module.exports = app;
