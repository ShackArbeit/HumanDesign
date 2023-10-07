import * as React from 'react';
import { useEffect,useState} from 'react'
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
  const[datas,setDatas]=useState([])
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        // const response = await fetch(`http://localhost:8000/aboutJerome/${id}`);
        // if (!response.ok) {
        //   throw new Error('Can not get data from port 8000 !');
        //  }
        //  const userData = await response.json();
        //  console.log(userData);
        //  setDatas((prevData) => [...prevData, userData]);
         const response2013 = await fetch("http://localhost:8000/aboutJerome/2013");
         const response2016 = await fetch("http://localhost:8000/aboutJerome/2016");
        const response2019 = await fetch("http://localhost:8000/aboutJerome/2019");
        const response2021 = await fetch("http://localhost:8000/aboutJerome/2021");
        const response2022 = await fetch("http://localhost:8000/aboutJerome/2022");
  
        const data2013 = await response2013.json();
        const data2016 = await response2016.json();
        const data2019 = await response2019.json();
        const data2021 = await response2021.json();
        const data2022 = await response2022.json();
  
        setDatas([data2013, data2016, data2019, data2021, data2022]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData()
  }, []);
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