import { useAboutJerome } from '../ReactQueryCompoents/AboutJeromeQuery';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import style from '../CssModules/Jerome.module.css'
import Container from 'react-bootstrap/Container';

const AboutJerome = () => {
  const { data: datas, isLoading, error } = useAboutJerome(); 
  if(isLoading) return<p>Loading...</p>
  if(error) return <p>Error:{error.message}</p>
  return (
    <>
     <Container className={style.JeromeContainer} fluid>
        <h3>關於 Jerome</h3>
        <Timeline position="alternate">
          {datas.map((data, index) => (
            <TimelineItem className={style.JeromeTimeItem} key={index}>
              <TimelineSeparator>
                <TimelineConnector className={style.JeromeImage} />
                <TimelineDot>
                  <img src={`https://picsum.photos/100/100?random=${data.id}`} style={{ borderRadius: '50%' }} />
                </TimelineDot>
                <div style={{width:"2px",height:"30px",backgroundColor:"black"}}/>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent className={style.JeromeContent}>
                <Typography>
                  <span className={style.JeromeYear}>{data.id}</span><br/>
                  <span className={style.JeromeTitle}>{data.title}</span><br/>
                  <span className={style.JeromeDec}>{data.content}</span>
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>
    </>
  )
}

export default AboutJerome