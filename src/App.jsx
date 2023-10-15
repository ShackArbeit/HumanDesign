import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout'
import AboutJerome from './PageComponents/AboutJerome';
import UserFeedBack from "./PageComponents/UserFeedBack";
import EntranceHome from "./PageComponents/HomePageComponents/EntranceHome";
import EntraceBooking from "./PageComponents/BookPageComponents/EntraceBooking";
import EntranceHumanDesign from "./PageComponents/WhatIsHumanComponents/EntranceHumanDesign";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/HumanDesign" element={<Layout />}>
        <Route path="" element={<EntranceHome />}/>
        <Route path="Jerome" element={<AboutJerome/>}/>
        <Route path="Feedback" element={<UserFeedBack/>}/>
        <Route path="booking" element={<EntraceBooking/>}/>
        <Route path="human" element={<EntranceHumanDesign/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
