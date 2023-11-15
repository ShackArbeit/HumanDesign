 import { useState, createContext } from 'react';
 import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 

 export const DateTimeContext = createContext();

 export default function DateTimeProvider({ children }) {

  const [selectDateTime, setSelectDateTime] = useState([]);
  const[showGoButton,setShowGoButton]=useState(false)
   const handleSelectDateTime = (newDateTime) => {
     setSelectDateTime(newDateTime);
   };
   const handleSendDateTime = async (event) => {
    try {
      const currentDate = dayjs();
      dayjs.locale('zh-cn');
      const selectedDate = dayjs(selectDateTime);
      const formattedDate = selectedDate.format(' YYYY   /   MM   /   DD    A hh:mm');
  
      // 防止選取過去的日期
      if (selectedDate.isBefore(currentDate, 'day')) {
        alert('你所選取的日期已經過去，請重新選擇');
        return;
      }
  
      // 只接受三天前的預約
      const minimumReservationDate = currentDate.add(3, 'day');
      if (selectedDate.isBefore(minimumReservationDate, 'day')) {
        alert(`抱歉，無法接受當日預約，只接受${minimumReservationDate.format('YYYY年MM月DD日')}起的預約`);
        return;
      // 若都不是前面用前端判斷的例外情形就進入後端 Api 判斷的邏輯
      } else {
        // 先向後端 Api 發送 Post 請求，將資料放入資料庫內
        const response = await fetch('http://localhost:8000/saveDateTime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectDateTime }),
        });
        // 將資料 JSON 格式化
        const responseData = await response.json();
        // 若是成功放入資料庫則返回放入成功的訊息並 Alert 出來
        if (responseData.success) {
          alert(`我們已成功接受您於 ${formattedDate} 的預約了 !`);
          setShowGoButton(true)
        // 這裡透過後端的 Api 先比較所要放入的資料時間點是否存在已經在 MongoDB 資料庫內所存放的時間點之前後
        // 90 分鐘的區間內
        } else {
          // responseData 是 status 為 400 時所返回的物件，並透過解構賦值存放在變數 Year,Month,Day,Hour,Minute 中
            const { Year, Month, Day, Hour, Minute } = responseData;
          // 設定前端要 Alert 訊息的變數，將前後 90 分鐘的區間透過 day.js 做計算
            const bookingTime = dayjs(`${Year}-${Month + 1}-${Day} ${Hour}:${Minute}`);
            const latestBookingTime = bookingTime.subtract(90, 'minutes');
            const earlyBookingTime = bookingTime.add(90, 'minutes');
             alert(`此時間屬在其他預約的時段內，你最早可於 ${Year} / ${Month + 1} /  ${Day} / ${latestBookingTime.format('HH:mm')} 前
            或 ${Year} /${Month + 1} / ${Day} / ${earlyBookingTime.format('HH:mm')}  後預約`);
            event.preventDefault();
            return; 
          }
      }
    } catch (error) {
      console.log('Error send to MongoDB', error);
    }
  };

   return (
     <DateTimeContext.Provider value={{ selectDateTime, handleSelectDateTime,handleSendDateTime,showGoButton}}>
       {children}
     </DateTimeContext.Provider>
     )
   }
