import style from '../../CssModules/HomePage.module.css'
import Container from 'react-bootstrap/Container';
import Box from '@mui/material/Box';
import { useBooking } from '../../ReactQueryCompoents/HomePageQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
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
const BookingProcess = () => {
  const { data: datas, isLoading, error } = useBooking();
  if(isLoading) return <p>Loading...</p>
  if(error) return <p>Error:{error.message}</p>
  return (
  <ThemeProvider theme={theme}>
    <Container className={style.bookProcessWrap}>
      <h1>預約流程</h1>
      <h2 className={style.bookProcessSubtitle}>S   T   E   P   S </h2>
      
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 2, sm: 6, md: 12 }}> 
      {datas.map((data)=>(
             <Grid item xs={12} sm={3} md={3} key={data.id}>
              <div className={style.BookingProcessContainer} >
             <div className={style.BookingProcessItem}>
             <img src={data.url} alt={data.id}></img>
             <div className={style.BookingProcessText}>
              <h5>{data.title}</h5>
              <span>{data.content}</span>
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
}

export default BookingProcess
