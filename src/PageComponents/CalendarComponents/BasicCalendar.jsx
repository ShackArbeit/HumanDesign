import style from '../../CssModules/Calendar.module.css'
import { Experimental_CssVarsProvider, useMediaQuery } from '@mui/material';
import {useState} from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
dayjs.locale('zh-cn');


export default function ResponsiveDateTimePickers() {
  const isDesktop = useMediaQuery('(min-width:576px)');
  const isMobile=useMediaQuery('(max-width:576px');
  const[selectDateTime,setSelectDateTime]=useState(null)
  const handleSelectDateTime = (newDateTime) => {
    setSelectDateTime(newDateTime);
  };
  const handleSendDateTime = async () => {
    try {
      const currentDate = dayjs();
      dayjs.locale('zh-cn');
      const selectedDate = dayjs(selectDateTime);
      const formattedDate = selectedDate.format('YYYY/MM/DD A hh:mm');
      if (selectedDate.isBefore(currentDate, 'day')) {
        alert('你所選取的日期已經過去，請重新選擇');
        return;
      }
      const minimumReservationDate = currentDate.add(3, 'day');
      const eralyReservationsTime=selectedDate.add(120,'minute').format('YYYY/MM/DD A hh:mm');
      const latestReservationsTime=selectedDate.subtract(140,'minute').format('YYYY/MM/DD A hh:mm');
      console.log(selectedDate)
     
      if (selectedDate.isBefore(minimumReservationDate, 'day')) {
        alert(`抱歉，無法接受當日預約，只接受${minimumReservationDate.format('YYYY年MM月DD日')}起的預約`);
        return;
      }
      else{
        const response = await fetch('http://localhost:8000/saveDateTime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectDateTime }),
        });
        if (response.ok) {
          alert(`我們已成功接受您於  ${formattedDate }  的預約了 !`)
          console.log(`我們已成功接受您於 ${formattedDate } 的預約了!`)
        }else{
          alert(`該區間已經有人先預約了，您可以於${latestReservationsTime}之前或${eralyReservationsTime}之後預約`)
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
      <button style={{widht:'300px',height:'100px',top:'100px'}}
      onClick={handleSendDateTime}
      >確定送出</button>
      </>
      ):null}
      {isMobile?( <DemoItem >
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
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn' />
      </DemoItem>):null}
    </div>
  </LocalizationProvider>
  );
}
