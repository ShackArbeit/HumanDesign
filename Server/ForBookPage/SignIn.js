const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const { SignUpModel } = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/directSignIn', async (req, res) => {
  try {
    await connectToDB();

    const { email, password } = req.body;

    const user = await SignUpModel.findOne({
      $and: [
        { Email: email },
        { Password: password }
      ]
    });

    if (user) {
      req.session.LogInUser = {
        sessionID: user.Sessions[0].sessionID,
        // 其他相關用戶信息...
      };

      console.log(req.session.LogInUser);

      res.json({
        success: true,
        message: '登入成功 !',
        Email: email,
        Password: password
      });
    } else {
      res.json({
        success: false,
        message: '登入失敗，Email 或 Password 有錯誤',
      });
    }
  } catch (error) {
    console.log('登入過程中發生錯誤', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
