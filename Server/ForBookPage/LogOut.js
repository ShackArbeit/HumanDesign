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
    // 先取得目前登入狀態使用者的 Sessions 物件
    const CheckcurrentUser = await SignUpModel.distinct('Sessions')
    // 將該 Sessions 物件當所蒐尋的標籤，取出目前真正登入狀態的使用者
    const currentUser=await SignUpModel.findOne({Sessions:CheckcurrentUser})
    console.log(currentUser)
    // 若是登入狀態，就將 Sessions 物件刪除，讓下次登入時建立新的 Sessions 物件
    if (CheckcurrentUser) {
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
