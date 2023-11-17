import {  useContext } from 'react';
import { DateTimeContext } from '../../ContextComponents/DataTimeContext';
import style from '../../CssModules/Booking.module.css'
import Container from 'react-bootstrap/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'



const CheckFirstBooking = () => {
  const { selectDateTime,firstValue,secondItem} = useContext(DateTimeContext);
  

  return (
    <div className={style.checkBookingFirstWrapper}>
      <Container className={style.checkBookingContainer} fluid>
          <p className={style.checkBookingItem}>預約年分 ： {selectDateTime.$y} </p>
          <p className={style.checkBookingItem} >預約月份 ： {selectDateTime.$M}  </p>
          <p className={style.checkBookingItem}>預約日期 ： {selectDateTime.$D} </p>
          <p className={style.checkBookingItem}> 預約時間 ：  {selectDateTime.$H}   時 {selectDateTime.$m}   分 </p>
          <p className={style.checkBookingItem}> 你所預約的項目為： {firstValue}  </p>
          <p className={style.checkBookingItem}> 你所預約的時長為： {secondItem}  </p>
          <Stack spacing={4} direction="row" sx={{margin:'0 auto'}}>  
              <Button variant="contained" sx={{padding:'1rem',fontSize:'20px'}} >刪除 & 重新預約 </Button>
              <Button variant="contained" sx={{padding:'1rem',fontSize:'20px'}} color="success">繼續 & 填寫基本資料 </Button>
            </Stack>
      </Container>
    </div>
  );
};

export default CheckFirstBooking;

