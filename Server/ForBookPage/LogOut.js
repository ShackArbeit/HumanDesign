const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const SignUpModel = require('../Model/ForAuth');
const sessionMiddleware = require('../Databse/Session');

app.use(sessionMiddleware);

const router = require('express').Router();

router.post('/logout', async (req, res) => {
  try {
    await connectToDB();
    const currentUser=await SignUpModel.findOne({})
     console.log(currentUser)
    if (currentUser) {
      currentUser.Sessions = [];
      await currentUser.save()
      res.json({
        success: true,
        message: '登出成功!',
      });
    } else {
      res.json({
        success: false,
        message: '找不到使用者，可能已經登出或帳號不存在',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
