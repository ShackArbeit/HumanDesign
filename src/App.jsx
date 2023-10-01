import { useEffect,useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <div>
        {data.map((item) => (
            <div key={item.id}>
             <p>Job: {item.job}</p>
             <p>Salary: {item.salary}</p>
              </div>
          ))}
        </div>
      </div>
      <h1>React Project for HumanDesign</h1>
    
    </>
  )
}

export default App
