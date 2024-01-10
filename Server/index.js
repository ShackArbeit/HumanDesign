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
const CheckBookingRouter=require('./ForCheckBooking/CheckBookingAuth')
const LogOutRouter=require('./ForBookPage/LogOut')
const SendEmailRouter=require('./ForSendEmai/SendCheckEmail')
const NotAuthBooking=require('./ForNoAuthBooking/NoAuthBooking')
const NotAuthDelete=require('./ForNoAuthBooking/NoAuthDelet')
const NotAuthSendEmail=require('./ForSendEmai/NotAuthSendEmail')
const ResendPassword=require('./ForBookPage/ResendPassword')
const cors = require('cors');
const sessionMiddleware=require('./Databse/Session')


const app = express();
app.use(sessionMiddleware)
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

// 以下為登入的路由部分
app.use(LogOutRouter)

// 以下為寄送確認 Email 的部分
app.use(SendEmailRouter)

// 以下為有註冊會員且預約後查詢預約資料的部分
app.use(CheckBookingRouter)

// 以下為未經註冊會員而預約的部分
app.use(NotAuthBooking)

// 以下為未經註冊會員預約後要刪除預約的部分
app.use(NotAuthDelete)

// 以下為未經註冊會員預約後寄出確認 Email 的部分
app.use( NotAuthSendEmail)

// 以下為忘記註冊時密碼的部分 
app.use(ResendPassword)

app.listen(8000,()=>{
      console.log('Server running at port 8000 !')
})