import { useCheckBooking } from '../../ReactQueryCompoents/CheckBookingQuery';
import style from '../../CssModules/HomePage.module.css'
import Box from '@mui/material/Box';
import Container from 'react-bootstrap/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useContext} from 'react'
import { DateTimeContext } from '../../ContextComponents/DataTimeContext';
import { SendEmailContext } from '../../ContextComponents/SendEmailContext';


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
  const {handleDeleteFirstBooking,notbooking}=useContext(DateTimeContext)
  const {handleSendEamil}=useContext( SendEmailContext )
  const { data: datas, isLoading, error } = useCheckBooking (); 
  console.log(datas)
  if(isLoading) return<p>Loading...</p>
  if(error) return <p>Error:{error.message}</p>
   
  return (
    <ThemeProvider theme={theme} >
    {datas && datas.length > 0?(
      <Container className={style.serviceWrap2} fluid>
      {notbooking?(
        <h1 style={{top:'3rem'}}>你的預約已刪除，請趕緊再次預約 !</h1>
      ):(
        <h2 className={style.serviceTitle}>謝謝你的預約以下為你的所有預約紀錄</h2>
      )}
      {notbooking ?( <div className={style.serviceContainer2}></div>):(
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 2, sm: 6, md: 12 }}>
           {datas.map((data) => (
              <Grid item xs={12} sm={3} md={3} key={data._id}>
                <div className={style.serviceContainer}>
                  <div className={style.serviceItem}>
                    <img src={`https://picsum.photos/300/300?random=${data._id}`} alt={`Image ${data._id}`} />
                    <div className={style.serviceText}>
                      <h2>{data.BookingItem}</h2>
                      <p>日期： {data.Year}.{data.Month + 1}.{data.Day}</p>
                      <p>時間：{data.Hour}時 {data.Minute}分</p>
                      <p>預約時長： {data.TimeItem}</p>
                      <Button
                      variant="contained"
                      size="small"
                      onClick={handleDeleteFirstBooking}
                      sx={{
                        fontWeight: 900,
                        fontSize: '18px',
                        '&:hover': {
                          border: '2px solid #ffa811',
                          color: 'black',
                          backgroundColor: '#fff',
                        },
                      }}
                      >刪除此次預約</Button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
      </Box>
      )}
      <Button
      variant="contained"
      size="small"
      onClick={handleSendEamil}
      sx={{
        fontWeight: 900,
        size:'large',
        fontSize: '20px',
        '&:hover': {
          border: '2px solid #ffa811',
          color: 'black',
          backgroundColor: '#fff',
        },
      }}
      >確認預約無誤</Button>
      </Container>
     
    ):(
      <div className={style.homeBannder}>
      <h1 style={{top:'3rem'}}>你還沒有任何預約紀錄，請趕緊預約 !</h1>
      </div>)}
    </ThemeProvider>
  );

 
};
 
export default CheckFirstBooking;