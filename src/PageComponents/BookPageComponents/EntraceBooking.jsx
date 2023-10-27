import { useEffect, useState } from 'react';

const EntraceBooking = () => {
  const [datas, setDatas] = useState([]);

  console.log(datas)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/dayWeek');
        const data = await response.json();
        setDatas(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  },[]);
  console.log(datas)
  return (
    <div style={{ width: "100%", height: "1000px", border: "2px solid red" }}>
    {datas.map((day, index) => {
      return (
        <h2 key={index}>{day}</h2>
      );
    })}
    </div>
  );
};

export default EntraceBooking;
