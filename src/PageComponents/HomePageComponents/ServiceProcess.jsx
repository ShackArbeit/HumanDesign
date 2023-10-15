import style from '../../CssModules/HomePage.module.css'
import { useSelector, useDispatch } from 'react-redux'
import {setServiceData} from '../../ToolkitComponents/HomePage/ServiceSlice'
import  { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from 'react-bootstrap/Container';
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


const ServiceProcess = () => {
      const datas=useSelector((state)=>state.Service)
      const dispatch=useDispatch()
      useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await fetch('http://localhost:8000/home/service');
                const Data = await response.json();
                dispatch(setServiceData(Data))
              } 
              catch (error) {
                console.log(error);
              }
            };
            fetchData();
          }, []);
  return (
   <ThemeProvider theme={theme}>
   <Container className={style.serviceWrap} fluid>
   <h2 className={style.serviceTitle} >解析項目</h2>
   <Box sx={{ flexGrow: 1 }}>
   <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 2, sm: 6, md: 12 }}>
   {datas.map((data)=>(
            <Grid item xs={12} sm={3} md={3} key={data.id}>
            <div className={style.serviceContainer}>
               <div className={style.serviceItem}>
               <img src={`https://picsum.photos/300/300?random=${data.id}`} alt={`Image ${data.id}`}/>
               <div className={style.serviceText}>
               <h2>{data.title}</h2>
               <p>{data.content}</p>
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

export default ServiceProcess
