import { useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setData } from '../ToolkitComponents/AboutJerome/AboutJeromeSlice';
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
  const datas=useSelector((state)=>state.aboutJerome)
  const dispatch=useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const years = [2013, 2016, 2019, 2021, 2022];
        const fetchedData = [];
        for (const year of years) {
          const response = await fetch(`http://localhost:8000/aboutJerome/${year}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${year}`);
          }
          const data = await response.json();
          fetchedData.push(data);
        }
        dispatch(setData(fetchedData));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dispatch]);
  
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