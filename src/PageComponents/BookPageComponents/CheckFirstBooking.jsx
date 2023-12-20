import {useEffect,useState} from 'react'




const CheckFirstBooking = () => {

    const[datas,setDatas]=useState([])
    useEffect(()=>{
        const checkBooking=async()=>{
          const response = await fetch('http://localhost:8000/checkBooking');
          const data=await response.json()
          setDatas(data)
          console.log(data)
        }
        checkBooking()
    },[])

  
  return (
    <>
    <h1>In This Page You Can Check Your Bookig !!</h1>
    <h2>City: {datas.City}</h2>
    <h2>Name: {datas.Name}</h2>
    <h2>Age: {datas.Age}</h2>
    </>
  )
};
 
export default CheckFirstBooking;
