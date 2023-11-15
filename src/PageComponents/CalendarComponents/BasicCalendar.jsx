import style from '../../CssModules/Calendar.module.css'
import {Link} from 'react-router-dom'
import {  useMediaQuery } from '@mui/material';
import {useState} from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import Button from '@mui/material/Button';
dayjs.locale('zh-cn');


export default function ResponsiveDateTimePickers() {
  const isDesktop = useMediaQuery('(min-width:576px)');
  const isMobile=useMediaQuery('(max-width:576px');
  const[selectDateTime,setSelectDateTime]=useState(null)
  const[showGoButton,setShowGoButton]=useState(false)
  const handleSelectDateTime = (newDateTime) => {
    setSelectDateTime(newDateTime);
  };
  // const Naigation=useNavigate()
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={style.BasicCalendarContainer}>
    <h3 style={{marginBottom:"3rem"}}>請點選日期及時間</h3>
      {isDesktop?(
        <>
        <DemoItem  >
        <DesktopDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width:"350px",
          border:'1px solid rgba(0,0,0,0.8)',
          transform: "translate(-50%, -50%)",
          '&:hover': {
            border:'1px solid #2fffe1;'
          }}} 
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn'
          slotProps={{ textField: { variant: 'outlined' } }}
          value={selectDateTime}
          onChange={handleSelectDateTime}
          />
      </DemoItem>
      {showGoButton ?
      <div className={style.ButtonContainer}>
      <Button 
      onClick={handleSendDateTime}
      variant="contained" 
      size='large'
      sx={{
        fontWeight:900,
        fontSize:'20px',
        marginRight:'1rem',
        '&:hover':{
          border:'2px solid #ffa811',
          color:'black',
          backgroundColor:'#fff'
        }
      }}>確定送出
      </Button>
      <Link to='firstCheck'> <Button 
      variant="contained" 
      size='large'
      sx={{
        fontWeight:900,
        fontSize:'20px',
        '&:hover':{
          border:'2px solid #ffa811',
          color:'black',
          backgroundColor:'#fff'
        }
      }}>前往確認頁面</Button></Link>
      </div>:
       <div className={style.ButtonContainer}>
        <Button 
        onClick={handleSendDateTime}
        variant="contained" 
        size='large'
        sx={{
          fontWeight:900,
          fontSize:'20px',
          '&:hover':{
            border:'2px solid #ffa811',
            color:'black',
            backgroundColor:'#fff'
          }
        }}
        >確定送出
        </Button>
        </div>
      }</>
      ):null }
      {isMobile?( 
      <>
      <DemoItem >
        <MobileDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width:"350px",
          border:'1px solid rgba(0,0,0,0.8)',
          transform: "translate(-50%, -50%)",
          '&:hover': {
              border:'1px solid #2fffe1;'
            },
        }}
          value={selectDateTime}
          onChange={handleSelectDateTime}
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn' />
      </DemoItem>
      {showGoButton ?
        <div className={style.ButtonContainerTwo}>
        <Button 
        onClick={handleSendDateTime}
        variant="contained" 
       
        sx={{
          fontWeight:900,
          fontSize:'20px',
          marginRight:'1rem',
          '&:hover':{
            border:'2px solid #ffa811',
            color:'black',
            backgroundColor:'#fff'
          }
        }}>確定送出
        </Button>
        <Link to='firstCheck'> <Button 
        variant="contained" 
        sx={{
          fontWeight:900,
          fontSize:'20px',
          '&:hover':{
            border:'2px solid #ffa811',
            color:'black',
            backgroundColor:'#fff'
          }
        }}>前往確認頁面</Button></Link>
        </div>:
         <div className={style.ButtonContainer}>
          <Button 
          onClick={handleSendDateTime}
          variant="contained" 
          size='large'
          sx={{
            fontWeight:900,
            fontSize:'20px',
            '&:hover':{
              border:'2px solid #ffa811',
              color:'black',
              backgroundColor:'#fff'
            }
          }}
          >確定送出
          </Button>
          </div>
        }
      </>)
      :null}
    </div>
  </LocalizationProvider>
  );
}
