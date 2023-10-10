import style from '../CssModules/FeedBack.module.css'
import Box from '@mui/material/Box';
import Container from 'react-bootstrap/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500, // Set the 'sm' breakpoint to 500px
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
});


const UserFeedBack = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container fluid className={style.userContainer}>
       <div className={style.jdContainer}>
       <h2 className={style.jdTitle}>JKの身心靈遊園車</h2>
      <h5>人類圖分析師Jerome
          和職場引導師Kevin<br/>
          陪伴你在不預期的人生旅程中
          順流而行，開拓生命的無限可能！
      ​</h5>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 2, sm:6,md: 12 }}>
        {Array.from(Array(4)).map((_, index) => (
          <Grid item xs={12}  sm={3} md={3} key={index}>
            <div className={style.jsCardContainer}>
            <div className={style.jdCard}>
                <img src='https://picsum.photos/100/100'/>
                <div className={style.jdCardDetail}>
                <div className={style.jdCardTitle}>JKの身心靈遊園車</div>
                <p>「我是誰」、「我想成為怎樣的人」、「我想創造怎樣的生活」
                  把前一季腦海中的夢想與熱情
                  更進一步落實為具體的行動</p>
                <a href="#!">觀看影片</a>
                </div>
            </div>
          </div>
          </Grid>
        ))}
      </Grid>
    </Box>
    </div>
    </Container>
    </ThemeProvider>
  )
}

export default UserFeedBack
