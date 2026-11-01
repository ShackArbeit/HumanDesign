import { QueryState } from '../components/QueryState';
import { useFeedbackVideos } from '../hooks/useContent';
import style from '../CssModules/FeedBack.module.css';
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
});

const UserFeedBack = () => {
  const query = useFeedbackVideos();
  return (
    <ThemeProvider theme={theme}>
      <Container fluid className={style.userContainer}>
        <div className={style.jdContainer}>
          <h2 className={style.jdTitle}>JKの身心靈遊園車</h2>
          <h5>
            人類圖分析師Jerome 和職場引導師Kevin
            <br />
            陪伴你在不預期的人生旅程中
            順流而行，開拓生命的無限可能！
          </h5>
          <QueryState query={query}>
          {(datas) => (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 2, sm: 6, md: 12 }}>
              {datas.map((data) => (
                <Grid item xs={12} sm={3} md={3} key={data.id}>
                  <div className={style.jsCardContainer}>
                    <div className={style.jdCard}>
                      <img src={`https://picsum.photos/100/100?random=${data.id}`} alt={`Image ${data.id}`} />
                      <div className={style.jdCardDetail}>
                        <div className={style.jdCardTitle}>{data.title}</div>
                        <p>{data.body}</p>
                        <a href={`https://youtu.be/${data.youtubeId}`} target="_blank" rel="noreferrer"
                        className={style.jdCardDetailLink}
                        >觀看影片</a>
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
          )}
          </QueryState>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default UserFeedBack;