const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const SignUpModel = require('../Model/ForAuth');
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
    // 若找到有註冊的使用者，就將登入時要建立的 Sessions 物件建立在同一個 document 下面
      user.Sessions = user.Sessions || [];
      user.Sessions.push({
        sessionID: req.sessionID,
        cookie: req.session.cookie,
        user: { Email: email, Password: password },
      });
      await user.save();
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
