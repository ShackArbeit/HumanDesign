const express=require('express')
const JeromeRouter=require('./ForSubPage/AboutJerome');
const FeedbackRouter=require('./ForSubPage/Feedback');
const HomePageRouter=require('./ForSubPage/HomePage')
const WhatHumanRouter=require('./ForSubPage/WhatIsHumanDesign')
const SignUpRouter=require('./ForBookPage/SignUp')
const SignInRouter=require('./ForBookPage/SignIn')
const SaveAndDeleteRouter=require('./ForBookPage/SaveAndDeleteInfo')
const GetRecordRouter=require('./ForBookPage/GetRecord')
const BookingIttroduceRouter=require('./ForSubPage/BookingIntroduction');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 以下為經過會員註冊後才預約的路由設定
// 所對應的 Collection 為 BookingAfterAuth
// 從註冊頁面向資料庫放入資料的路由設定
app.use(SignUpRouter)
// 經過註冊後，需要判斷所輸入的 Email 及 Password 是否已存在資料庫內
// 的路由設定
app.use(SignInRouter)
// 第一次輸入預約時間及項目，以及要刪除的路由設定
app.use(SaveAndDeleteRouter)

app.use(GetRecordRouter)

// 關於 Jerome 分頁
app.use(JeromeRouter)
// 觀眾回饋
app.use(FeedbackRouter)
//首頁解析項目區塊 以及 首頁預約流程區塊
app.use(HomePageRouter)
// 介紹人類圖是什麼部分
app.use(WhatHumanRouter)
// 以下為介紹不同預約類型的部分
app.use(BookingIttroduceRouter)

app.listen(8000,()=>{
      console.log('Server running at port 8000 !')
})