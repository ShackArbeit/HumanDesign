import { QueryState } from '../components/QueryState';
import { useAboutTimeline } from '../hooks/useContent';
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
  const query = useAboutTimeline();
  return (
    <>
     <Container className={style.JeromeContainer} fluid>
        <h3>關於 Jerome</h3>
        <QueryState query={query}>
        {(datas) => (
        <Timeline position="alternate">
          {datas.map((data, index) => (
            <TimelineItem className={style.JeromeTimeItem} key={index}>
              <TimelineSeparator>
                <TimelineConnector className={style.JeromeImage} />
                <TimelineDot>
                  <img src={`https://picsum.photos/100/100?random=${data.year}`} alt="" style={{ borderRadius: '50%' }} />
                </TimelineDot>
                <div style={{width:"2px",height:"30px",backgroundColor:"black"}}/>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent className={style.JeromeContent}>
                <Typography>
                  <span className={style.JeromeYear}>{data.year}</span><br/>
                  <span className={style.JeromeTitle}>{data.title}</span><br/>
                  <span className={style.JeromeDec}>{data.body}</span>
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        )}
        </QueryState>
      </Container>
    </>
  )
}

export default AboutJerome