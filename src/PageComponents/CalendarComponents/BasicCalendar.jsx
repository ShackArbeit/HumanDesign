import style from '../../CssModules/Calendar.module.css'
import { useMediaQuery } from '@mui/material';
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
    console.log(selectDateTime)
  };
  const handleSendDateTime=async ()=>{
      try{
        const response=await fetch('http://localhost:8000/saveDateTime',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({selectDateTime})
        })
        if(response.ok){
          console.log('DateTime sent to MongoDB successfully');
        }else{
          console.log('Error sending DateTime to MongoDB. Status:', response.status);
          const errorResponse = await response.json();
          console.log('Error message:', errorResponse.message);
        }
        if (response.status === 400 && errorResponse.message === 'DateTime already exists within the next 150 minutes!') {
          alert('預約時間需要至少相隔 150 分鐘。請選擇其他時間。');
          return ;
        }
      }catch(error){
         console.log('Error send to MongoDB',error)
      }
  }
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
