import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout'
import AboutJerome from './PageComponents/AboutJerome';
import UserFeedBack from "./PageComponents/UserFeedBack";
import EntranceHome from "./PageComponents/HomePageComponents/EntranceHome";
import EntraceBooking from "./PageComponents/BookPageComponents/EntraceBooking";
import EntranceHumanDesign from "./PageComponents/WhatIsHumanComponents/EntranceHumanDesign";
import ExplainHumanDesign from  './PageComponents/WhatIsHumanComponents/ExplainHumanDesign'
import TalentHumanDesign from "./PageComponents/WhatIsHumanComponents/TalentHumanDesign";
import RoleHumanDesign from "./PageComponents/WhatIsHumanComponents/RoleHumanDesign";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/HumanDesign" element={<Layout />}>
        <Route path="" element={<EntranceHome />}/>
        <Route path="Jerome" element={<AboutJerome/>}/>
        <Route path="Feedback" element={<UserFeedBack/>}/>
        <Route path="booking" element={<EntraceBooking/>}/>
        // 以下是人類的分頁的子項目Router
        <Route path="human" element={<EntranceHumanDesign/>}/>
        <Route path='human/使用說明書' element={<ExplainHumanDesign/>}/>
        <Route path='human/天賦類型' element={<TalentHumanDesign/>}/>
        <Route path='human/人生角色' element={<RoleHumanDesign/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
