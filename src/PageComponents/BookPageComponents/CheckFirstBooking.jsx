import { useCheckBooking } from '../../ReactQueryCompoents/CheckBookingQuery';
import styles from '../../CssModules/Booking.module.css'
import style from '../../CssModules/HomePage.module.css'
import Box from '@mui/material/Box';
import Container from 'react-bootstrap/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
})

const CheckFirstBooking = () => {
  const { data: datas, isLoading, error } = useCheckBooking (); 
  console.log(datas)
  if(isLoading) return<p>Loading...</p>
  if(error) return <p>Error:{error.message}</p>
   

  return (
    <ThemeProvider theme={theme}>
    <Container className={style.serviceWrap2} fluid>
    <h2 className={style.serviceTitle} >你的所有預約紀錄</h2>
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={{ xs: 1, md: 2}} columns={{ xs: 2, sm: 6, md: 12 }}>
    {datas.map((data)=>(
             <Grid item xs={12} sm={3} md={3} key={data._id}>
             <div className={style.serviceContainer}>
                <div className={style.serviceItem}>
                <img src={`https://picsum.photos/300/300?random=${data._id}`} alt={`Image ${data._id}`}/>
                <div className={style.serviceText}>
                <h2>{data.BookingItem}</h2>
                <p>日期： {data.Year}.{data.Month + 1}.{data.Day}</p>
                <p>時間：{data.Hour}時 {data.Minute}分</p>
                <p>預約時長： {data.TimeItem}</p>
                </div>
                </div>
             </div>
             </Grid>
         ))}
    </Grid>
    </Box>
    </Container>
   
    </ThemeProvider>
  )
};
 
export default CheckFirstBooking;
