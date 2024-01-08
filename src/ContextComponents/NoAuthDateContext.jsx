import { useState, createContext } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 
import Swal from 'sweetalert2';
export const NoAuthDateTimeContext = createContext();
import {useNavigate } from 'react-router-dom'



const options = {
 個人解析: ['60分鐘 5,000 元', '120 分鐘 9,000 元'],
 多人解析: ['60分鐘 7,000 元', '120 分鐘 12,000 元'],
 親子解析: ['60分鐘 8,000 元', '120 分鐘 14,000 元'],
 團體解析: ['60分鐘 9,000 元', '120 分鐘 15,000 元'],
};


export default function NoAuthDateTimeProvider({ children }) {
  const negative=useNavigate()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 const [email,setEmail]=useState('')
 const [selectDateTime, setSelectDateTime] = useState([]);
 const [showGoButton,setShowGoButton]=useState(false)
 const [showOriginButton,setShowOriginButton]=useState(false)
 const [firstValue, setFirstValue] = useState(null);
 const [secondOptions, setSecondOptions] = useState([]);
 const [secondItem,setSecondItem]=useState(null);


 // 選取預約項目第一分項的 function 
 const handleFirstAutocompleteChange = (event, newValue) => {
   setFirstValue(newValue);
   setSecondOptions(options[newValue] || []);
 };
 // 選取預約項目第二分項的 function 
 const handleSecondAutocompleteChange=(event,newItem)=>{
     setSecondItem(newItem)
    setSecondOptions(options[newItem] || []);
 }
 // 選取項目的 function 
  const handleSelectDateTime = (newDateTime) => {
    setSelectDateTime(newDateTime);
  };
  // 若選擇不想選的項目、日期時間後想要重新選取的 fucntion 
  const handleResetBooking=()=>{
      if(selectDateTime && firstValue && secondItem){
            setSelectDateTime([])
            setFirstValue('');
            setSecondItem('')
      }
  }
  // 選取完成預約項目後的送出的 function 
  const handleSendDateTime = async (event) => {
    const currentDate = dayjs();
    dayjs.locale('zh-cn');
    const selectedDate = dayjs(selectDateTime);
    const formattedDate = selectedDate.format(' YYYY   /   MM   /   DD    A hh:mm');
    const minimumReservationDate = currentDate.add(3, 'day');
    // 確保 Email 格式正確 
    if(!emailRegex.test(email)){
      Swal.fire({
        title: '格式錯誤',
        text: '電子信箱格式不符合要求，請重新輸入 !',
        icon: 'error',
        confirmButtonText: '了解'
      })
      return 
    }
    // 防止選取過去的日期
       if (selectedDate.isBefore(currentDate, 'day')) {
        Swal.fire({
          title: '選取錯誤',
          text: '你所選取的日期已經過去，請重新選擇',
          icon: 'error',
          confirmButtonText: '了解'
        })
        return;
      }
    // 防止沒有選取日期及時間
      if (selectDateTime === null || selectDateTime.length === 0) {
        Swal.fire({
          title: '選取錯誤',
          text: '你沒有選取日期及時間 !',
          icon: 'error',
          confirmButtonText: '了解'
        })
        return;
      }
      if (selectDateTime && selectDateTime.length > 0 && (firstValue==='' || secondItem ==='')) {
       alert('你尚未選取任何項目！');
        return; 
      }
        // 只接受三天前的預約
   if (selectedDate.isBefore(minimumReservationDate, 'day')) {
     Swal.fire({
      title: '選取錯誤',
      text: `抱歉，無法接受當日預約，只接受${minimumReservationDate.format('YYYY年MM月DD日')}起的預約`,
      icon: 'error',
      confirmButtonText: '了解'
    })
      return;
     }
  
    // 若都不是前面用前端判斷的例外情形就進入後端 Api 判斷的邏輯
  try {
      // 先向後端 Api 發送 Post 請求，將資料放入資料庫內
      const response = await fetch('http://localhost:8000/noAuthBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectDateTime,firstValue, secondItem,email}),
      });
      // 將資料 JSON 格式化
      const responseData = await response.json();
      console.log(responseData)
      // 若是成功放入資料庫則返回放入成功的訊息並 Alert 出來
      if (responseData.success) {
        Swal.fire({
          title: '預約成功',
          text: `我們已成功接受您於 ${formattedDate} 的預約了 !`,
          icon: 'success',
          confirmButtonText: '了解'
        })
        localStorage.setItem('bookingIdToDelete', responseData.id);
        setShowGoButton(true)
        setShowOriginButton(false); 
      // 這裡透過後端的 Api 先比較所要放入的資料時間點是否存在已經在 MongoDB 資料庫內所存放的時間點之前後
      // 90 分鐘的區間內
      } else {
      
        // responseData 是 status 為 400 時所返回的物件，並透過解構賦值存放在變數 Year,Month,Day,Hour,Minute 中
          const { Year, Month, Day, Hour, Minute } = responseData;
        // 設定前端要 Alert 訊息的變數，將前後 90 分鐘的區間透過 day.js 做計算
          const bookingTime = dayjs(`${Year}-${Month + 1}-${Day} ${Hour}:${Minute}`);
          const latestBookingTime = bookingTime.subtract(90, 'minutes');
          const earlyBookingTime = bookingTime.add(90, 'minutes');
          Swal.fire({
            title: '選取錯誤',
            text: `此時間屬在其他預約的時段內，你最早可於 ${Year} / ${Month + 1} /  ${Day} / ${latestBookingTime.format('HH:mm')} 前
            或 ${Year} /${Month + 1} / ${Day} / ${earlyBookingTime.format('HH:mm')}  後預約`,
            icon: 'warning',
            confirmButtonText: '了解'
          })
          event.preventDefault();
          return; 
      }
    }
  catch (error) {
    console.log('Error send to MongoDB', error);
  }
};
 // 刪除預約的 function 
 const handleDeleteFirstBooking = async () => {
   try {
    const bookingIdToDelete = localStorage.getItem('bookingIdToDelete');
    const userConfirmed = window.confirm('請確定要刪除預約嗎 ?');
     if (userConfirmed) {
       const response = await fetch(`http://localhost:8000/noAuthDelete/${bookingIdToDelete}`, {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json',
         },
       });
       const responseData = await response.json();
       console.log(responseData);
       if (responseData.success) {
         Swal.fire({
          title: '刪除成功',
          text: '已經成功刪除你的預約了 !',
          icon: 'success',
          confirmButtonText: '了解'
        })
        localStorage.removeItem('bookingIdToDelete')
         setSelectDateTime([])
         setFirstValue('');
         setSecondItem('')
         setShowOriginButton(true);
       } else {
         alert('刪除失敗或找不到預約');
         Swal.fire({
          title: '刪除失敗',
          text: '刪除失敗或找不到預約',
          icon: 'error',
          confirmButtonText: '了解'
        })
       }
     } else {
       alert('取消刪除預約');
       return 
     }
   } catch (error) {
     console.error('Error deleting booking:', error);
   }
 };
 // 回到首頁，順便寄確認 Email 給沒有註冊的使用者
 const handleSendEmail=async ()=>{
    try{
        const userConfirmed = window.confirm('確認預約後將無法再更改預約，已考慮清楚 ?');
        if(userConfirmed){
          const response=await fetch('http://localhost:8000/NoauthSendEmail',{
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const responseData=await response.json()
          console.log(responseData)
          if(responseData.success){
            const result = await Swal.fire({
              title: '確認信',
              text: '將返回首頁，請到你的信箱查看確認信',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: '了解並返回首頁',
              cancelButtonText: '再想想',
            });
            if (result.isConfirmed) {
              negative('/HumanDesign')
            } else {
              Swal.fire({
                title: '再想想',
                text: '請刪除預約或重新選取',
                icon: 'question',
                confirmButtonText: '了解',
              });
            }
          }  
        }      
    }catch(error){
      console.log('無法寄出確認信',error)
    }
 }
  return (
    <NoAuthDateTimeContext.Provider value={{ 
     selectDateTime, 
     handleSelectDateTime,
     handleSendDateTime,
     showGoButton,
     showOriginButton,
     firstValue,
     secondOptions,
     handleFirstAutocompleteChange,
     secondItem,
     handleSecondAutocompleteChange,
     handleDeleteFirstBooking,
     handleResetBooking,
     setEmail,
     handleSendEmail
   }}>
      {children}
    </NoAuthDateTimeContext.Provider>
    )
  }