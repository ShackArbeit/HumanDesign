const express = require('express');
const app = express();
const connectToDB = require('../Databse/ConnectToMongoDB');
const { SignUpModel } = require('../Model/ForAuth');
const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


app.use(session({
  secret: 'HumanDesign Booking',
  resave: false,
  saveUninitialized: true,
  store:new MongoDBStore({
    uri:url,
    databaseName: 'myWebsite',
    collection: 'users'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
}))


const router = require('express').Router();

router.post('/signUp', async (req, res) => {
  try {
    console.log(SignUpModel);
    await connectToDB();
    const { email, password, confirmPassword } = req.body;

    const checkEmail = await SignUpModel.findOne({ Email: email });
    if (checkEmail !== null) {
      res.json({
        success: false,
        message: '註冊失敗，因為信箱重複',
      });
    } else {
      const newUser = new SignUpModel({
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
      });
      await newUser.save();
      req.session.regenerate((err) => {
        if (err) {
          console.error('Error regenerating session:', err);
        }
        // 將新用戶的信息存儲在會話中
        req.session.user = { Email: newUser.Email, Password: newUser.Password };
      })
      console.log(req.sessionID)
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
