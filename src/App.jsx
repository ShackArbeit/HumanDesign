import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout'
import AboutJerome from './PageComponents/AboutJerome';

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/HumanDesign" element={<Layout />}>
        <Route path="Jerome" element={<AboutJerome/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
