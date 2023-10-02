import { useEffect,useState} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout/Layout'


function App() {
  const[data,setData]=useState([])
   useEffect(()=>{
    const fetchApi=async()=>{
      try{
        const response=await fetch('http://localhost:8000/user')
        if(!response){
          throw new Error('Can not get data from port 8000 !')
        }
        const Userdata=await response.json()
        console.log(Userdata)
        setData(Userdata)
      }catch(error){
        console.log()
      }
    }
    fetchApi()
   },[])

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/HumanDesign" element={<Layout />}>
        </Route>
      </Routes>
    </BrowserRouter>
    <h1>React Project for HumanDesign</h1>
        {data.map((item) => (
            <div key={item.id}>
             <p>Job: {item.job}</p>
             <p>Salary: {item.salary}</p>
              </div>
          ))}
    </>
  )
}

export default App
