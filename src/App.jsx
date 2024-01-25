import { BrowserRouter, Routes, Route } from "react-router-dom";
import DateTimeProvider from "./ContextComponents/DataTimeContext";
import SignUpProvider from "./ContextComponents/SignUpContext";
import SignInProvider from "./ContextComponents/SignInContext";
import SendEmailProvider from "./ContextComponents/SendEmailContext";
import NoAuthDateTimeProvider from "./ContextComponents/NoAuthDateContext";
import ReDateTimeProvider from "./ContextComponents/ReBookingDateTimteContext";
import Layout from './Layout/Layout'
import AboutJerome from './PageComponents/AboutJerome';
import UserFeedBack from "./PageComponents/UserFeedBack";
import EntranceHome from "./PageComponents/HomePageComponents/EntranceHome";
import EntraceBooking from "./PageComponents/BookPageComponents/EntraceBooking";
import EntranceHumanDesign from "./PageComponents/WhatIsHumanComponents/EntranceHumanDesign";
import ExplainHumanDesign from  './PageComponents/WhatIsHumanComponents/ExplainHumanDesign'
import TalentHumanDesign from "./PageComponents/WhatIsHumanComponents/TalentHumanDesign";
import RoleHumanDesign from "./PageComponents/WhatIsHumanComponents/RoleHumanDesign";
import AuthorHumanDesign from "./PageComponents/WhatIsHumanComponents/AuthorHumanDesign";
import EnergyHumanDesign from "./PageComponents/WhatIsHumanComponents/EnergyHumanDesign";
import RoadHumanDesign from "./PageComponents/WhatIsHumanComponents/RoadHumanDesign";
import RaUraHumanDesign from "./PageComponents/WhatIsHumanComponents/RaUraHumanDesign";
import CircileHumanDesign from "./PageComponents/WhatIsHumanComponents/CircileHumanDesign";
import BasicCalendar from "./PageComponents/CalendarComponents/BasicCalendar";
import SignUp from "./PageComponents/AuthPageComponents/SignUp";
import AfterSignUp from "./PageComponents/AuthPageComponents/AfterSignUp";
import SignIn from "./PageComponents/AuthPageComponents/SignIn";
import NotAuthEntraceBooking from "./PageComponents/BookPageComponents/NoAuthEntranceBooking";
import NotAuthBasicCalendar from "./PageComponents/CalendarComponents/NotAuthBasicCalendar";
import CheckFirstBooking from "./PageComponents/BookPageComponents/CheckFirstBooking";
import AgainBookingCalendar from "./PageComponents/CalendarComponents/AgainBookingCalendar";
import  ForgotPassword  from "./PageComponents/ForgotPasswordComponents/ForgotPassword";
import EmailJormen from "./PageComponents/EmailJormen/EmailJormen";


function App() {
  const StorageEmail=localStorage.getItem('rememberedEmail')
  const StoragePassword=localStorage.getItem('remeberMePassword')
  console.log(StorageEmail,StoragePassword)
  return (
     <BrowserRouter>
     <ReDateTimeProvider>
     <NoAuthDateTimeProvider>
     <DateTimeProvider>
     <SignUpProvider>
      <SignInProvider>
      <SendEmailProvider>
      <Routes>
        <Route path="/HumanDesign" element={<Layout />}>
          <Route path="" element={<EntranceHome />}/>
          <Route path="Jerome" element={<AboutJerome/>}/>
          <Route path="Feedback" element={<UserFeedBack/>}/>
          //以下為註冊的路由
          <Route path='signup' element={<SignUp/>}/>
          <Route path='afterSignUp' element={<AfterSignUp/>}/>
        // 以下為登入的路由
        <Route path='signin' element={<SignIn/>}/>
        // 這裡是有經過註冊後所到的預約頁面的路由
         {StorageEmail && StoragePassword ? (
          <>
          <Route path="bookingAfterSignIn" element={<EntraceBooking/>}/>
          <Route path="bookingAfterSignIn/calendar" element={<BasicCalendar />}/>
          <Route path="bookingAfterSignIn/checkBooking" element={<CheckFirstBooking />}/>
          <Route path="bookingAfterSignIn/reBooking" element={<AgainBookingCalendar />}/>
          </>
         ):(window.alert('你必須先註冊才可以使用看到此路由'))
        }
          

        // 這裡是沒有經過註冊所到的預約頁面的路由
         <Route path='notAuthBooking' element={<NotAuthEntraceBooking/>}/>
         <Route path='notAuthBooking/notAuthCalendar' element={<NotAuthBasicCalendar/>}/>
        // 以下是註冊後忘記密碼的重新發送密碼的頁面路由
        <Route path='signin/resendPassword' element={< ForgotPassword/>}/>
        // 以下為讓使用者寄送回饋 Email 的頁面路由
        <Route path='emailUs' element={<EmailJormen/>}/>
          // 以下是人類的分頁的子項目Router
          <Route path="human" element={<EntranceHumanDesign/>}/>
          <Route path='human/使用說明書' element={<ExplainHumanDesign/>}/>
          <Route path='human/天賦類型' element={<TalentHumanDesign/>}/>
          <Route path='human/人生角色' element={<RoleHumanDesign/>}/>
          <Route path='human/內在權威' element={<AuthorHumanDesign/>}/>
          <Route path='human/能量中心' element={<EnergyHumanDesign/>}/>
          <Route path='human/通道' element={<RoadHumanDesign />}/>
          <Route path='human/輪迴交叉' element={<CircileHumanDesign />}/>
          <Route path='human/起源' element={<RaUraHumanDesign />}/>
        </Route>
      </Routes>
      </SendEmailProvider>
      </SignInProvider>
      </SignUpProvider>
      </DateTimeProvider>
      </NoAuthDateTimeProvider>
      </ReDateTimeProvider>
    </BrowserRouter>
  )
}

export default App