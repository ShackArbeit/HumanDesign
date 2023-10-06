import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import style from '../CssModules/Jerome.module.css'
import Container from 'react-bootstrap/Container';

const AboutJerome = () => {
  return (
    <Container className={style.JeromeContainer} fluid>
    <h1>關於 Jerome</h1>
    <Timeline position="alternate" >
    <TimelineItem className={style.JeromeTimeItem}>
      <TimelineSeparator>
        <TimelineConnector className={style.JeromeImage}/>
        <TimelineDot >
        <img src="https://picsum.photos/100/100?random=2"  style={{borderRadius:"50%"}}/>
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent  className={style.JeromeContent}>
        <Typography variant="h6" component="span">
          Code
        </Typography>
        <Typography>Because it&apos;s awesome!</Typography>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem className={style.JeromeTimeItem}>
    <TimelineSeparator>
      <TimelineConnector />
      <TimelineDot >
      <img src="https://picsum.photos/100/100?random=1"  style={{borderRadius:"50%"}}/>
      </TimelineDot>
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent  className={style.JeromeContent}>
      <Typography variant="h6" component="span">
        Eat
      </Typography>
      <Typography>Because you need strength</Typography>
    </TimelineContent>
  </TimelineItem>
    <TimelineItem className={style.JeromeTimeItem}>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot >
        <img src="https://picsum.photos/100/100?random=3" style={{borderRadius:"50%"}} />
        </TimelineDot>
        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
      </TimelineSeparator>
      <TimelineContent className={style.JeromeContent}>
        <Typography variant="h6" component="span">
          Sleep
        </Typography>
        <Typography>Because you need rest</Typography>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem className={style.JeromeTimeItem}>
      <TimelineSeparator>
        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
        <TimelineDot  >
        <img src="https://picsum.photos/100/100?random=4" style={{borderRadius:"50%"}} />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent className={style.JeromeContent}>
        <Typography variant="h6" component="span">
          Repeat
        </Typography>
        <Typography>Because this is the life you love!</Typography>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
  </Container>
  )
}

export default AboutJerome