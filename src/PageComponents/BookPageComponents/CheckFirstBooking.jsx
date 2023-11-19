import {  useContext } from 'react';
import { DateTimeContext } from '../../ContextComponents/DataTimeContext';
import style from '../../CssModules/Booking.module.css'
import { styled } from '@mui/system';
import { Container, Paper, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'

const StyledPaper = styled(Paper)({
  padding: '20px',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  marginTop: '50px',
});

const CheckFirstBooking = () => {
  const { selectDateTime,firstValue,secondItem} = useContext(DateTimeContext);
  

  return (
    <Container>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          預約詳細資訊
        </Typography>
        <Typography className={style.checkBookingItem}>預約年分: {selectDateTime.$y}</Typography>
        <Typography className={style.checkBookingItem}>預約月份: {selectDateTime.$M}</Typography>
        <Typography className={style.checkBookingItem}>預約日期: {selectDateTime.$D}</Typography>
        <Typography className={style.checkBookingItem}>
          預約時間: {selectDateTime.$H} 時 {selectDateTime.$m} 分
        </Typography>
        <Typography className={style.checkBookingItem}>你所預約的項目為: {firstValue}</Typography>
        <Typography className={style.checkBookingItem}>你所預約的時長為: {secondItem}</Typography>
        <Stack spacing={2} direction="row" sx={{ justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="contained" sx={{ padding: '.5rem', fontSize: '15px' }}>
            刪除 & 重新預約
          </Button>
          <Button variant="contained" sx={{ padding: '.5rem', fontSize: '15px' }} color="success">
            繼續 & 填寫基本資料
          </Button>
        </Stack>
      </StyledPaper>
    </Container>
  );
};

export default CheckFirstBooking;

