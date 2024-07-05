import style from '../../CssModules/Booking.module.css'
import { useMediaQuery } from '@mui/material';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import  { useEffect,useState} from 'react';
import {Link} from 'react-router-dom'


const NotAuthEntraceBooking = () => {
    const isDesktop = useMediaQuery('(min-width:576px)');
    const isMobile=useMediaQuery('(max-width:576px');
    const[dataOne,setDataOne]=useState([])
    const [dataTwo,setDataTwo]=useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://humannode.onrender.com/bookingIntroduction/isDesktop');
            const Data = await response.json();
            setDataOne(Data)
          } 
          catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, []);
  
      useEffect(() => {
        const fetchData2 = async () => {
          try {
            const response = await fetch('https://humannode.onrender.com/bookingIntroduction/isMobile');
            const Data = await response.json();
            setDataTwo(Data)
          } 
          catch (error) {
            console.log(error);
          }
        };
        fetchData2();
      }, []);
    
  return (
     <div className={style.bookingEntranceContainer}>
     <h1>分析項目列表</h1>
     {dataOne.map((data1,index)=>(
      isDesktop && <div style={{margin:"1rem"}} key={index}> <div className={style.bookingEntranceListsContainer} >
      <Stack
        direction={{  sm: 'row',xs:'row' }}
      >
        <div className={style.bookingListImageContainer}>
        <img src={data1.urlOne}
        style={{width:"40px",height:"40px"}}/>
        <img src={data1.urlTwo}
        style={{width:"90px",height:"90px"}}
        />
        </div>
        <div className={style.bookingItems}>
        <Card>
        <CardContent className={style.CardContent}>
          <Typography 
          sx={{ fontSize: 25,textAlign:"left" }} 
          color="text.secondary"  >
            {data1.title}
          </Typography>
          <Typography  component="div" style={{textAlign:"left",fontSize:15}}>
           {data1.content}
          </Typography>
          <Typography sx={{ textAlign:"left"}} className={style.bookingItemsIcons}>
          <svg viewBox="0 0 800 800" xmlnsXlink="http://www.w3.org/2000/svg" style={{width:"15px",height:"15px"}}>
          <path d="m0 0h800v800h-800z" fill="#3b81f5"></path>
          <path d="m654.37 323.03c-17.73-23.12-42.94-39.27-71.21-45.76l11.43-93.48c1.87-15.33-10.09-28.84-25.53-28.84h-423.5c-15.44 0-27.4 13.51-25.53 28.84l42.35 346.42c8.01 65.51 63.63 114.74 129.62 114.74h130.62c65.99 0 121.62-49.24 129.62-114.74l.75-6.16c.93.02 1.86.03 2.79.03l-.06-.07c31.19-.13 61.2-11.92 84.14-33.05s37.15-50.08 39.83-81.15-6.35-62.03-25.33-86.78zm-12.62 92.21c-4.24 22.65-17.3 42.68-36.31 55.69-14.2 9.72-30.85 14.93-47.81 15.17l20.88-170.83c20.1 5.3 37.72 17.63 49.54 34.9 13.01 19.01 17.94 42.41 13.7 65.06z" fill="#fff"></path>
          <path d="m458.74 317.2h-83.93v-42.25c0-9.67-7.83-17.5-17.5-17.5s-17.5 7.83-17.5 17.5v42.25h-83.93c-9.67 0-17.5 7.83-17.5 17.5v102.02c0 9.67 7.83 17.5 17.5 17.5h83.93v70.72c0 9.67 7.83 17.5 17.5 17.5s17.5-7.83 17.5-17.5v-70.72h83.93c9.67 0 17.5-7.83 17.5-17.5v-102.02c0-9.67-7.83-17.5-17.5-17.5zm-185.36 102.02v-67.02h66.43v67.02zm167.86 0h-66.43v-67.02h66.43z" fill="#262626"></path>
          </svg>
          <span>中文分析</span>
          <svg width="15px" height="15px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#00AFF0">
							<g>
							<path d="M246.93895,149.01069 C246.857867,149.460702 246.801109,149.914768 246.715971,150.364779 L246.278122,147.786333 C246.517317,148.187695 246.715971,148.605274 246.93895,149.01069 C248.260607,141.818608 248.953868,134.456251 248.953868,127.097949 C248.953868,110.779951 245.759189,94.948452 239.44686,80.0453559 C233.35751,65.64903 224.645118,52.7203104 213.536717,41.6200174 C202.444532,30.5197244 189.507704,21.8073323 175.119487,15.7179824 C160.220445,9.41376198 144.388946,6.21908306 128.070948,6.21908306 C120.380204,6.21908306 112.677298,6.94072373 105.181154,8.37995091 C105.164938,8.38400507 105.144667,8.38400507 105.124396,8.38805923 C105.546029,8.61103809 105.971716,8.80969198 106.38524,9.04077916 L103.843281,8.64347138 C104.268968,8.56238815 104.698709,8.47319661 105.124396,8.38805923 C94.8389896,2.91899596 83.2724681,0 71.564051,0 C52.4486816,0 34.4765856,7.4434397 20.9600127,20.9640668 C7.44749386,34.4806398 0,52.4527358 0,71.5681052 C0,83.7346425 3.12981234,95.6944176 9.00429171,106.263615 C9.08132077,105.825766 9.13402486,105.383863 9.21916225,104.946013 L9.65701164,107.479864 C9.42997862,107.082556 9.23132473,106.669032 9.00429171,106.263615 C7.81236836,113.111094 7.18397339,120.108576 7.18397339,127.097949 C7.18397339,143.420002 10.3786523,159.247446 16.6909811,174.154597 C22.7722227,188.554977 31.4886689,201.475588 42.5849078,212.575881 C53.6933091,223.676174 66.6139203,232.400728 81.0183546,238.473862 C95.9173965,244.790245 111.75295,247.988978 128.070948,247.988978 C135.173838,247.988978 142.292945,247.340312 149.241777,246.107847 C148.836361,245.880814 148.422836,245.674052 148.009312,245.434856 L150.591812,245.888922 C150.145855,245.97406 149.695843,246.026764 149.241777,246.107847 C159.948816,252.164764 172.070758,255.383768 184.448111,255.383768 C203.559427,255.383768 221.523414,247.95249 235.039987,234.427809 C248.560614,220.919344 256,202.943194 256,183.827825 C256,171.620746 252.853971,159.620429 246.93895,149.01069 L246.93895,149.01069 Z M128.553393,201.130984 C85.6076649,201.130984 66.3949956,180.016913 66.3949956,164.193523 C66.3949956,156.077092 72.3870457,150.389104 80.6453718,150.389104 C99.0228838,150.389104 94.2632988,176.777639 128.553393,176.777639 C146.10791,176.777639 155.801409,167.246306 155.801409,157.491995 C155.801409,151.625624 152.906738,145.122749 141.348325,142.272674 L103.15002,132.737287 C72.3870457,125.022219 66.8044659,108.39205 66.8044659,92.759205 C66.8044659,60.3015916 97.364732,48.1147834 126.064138,48.1147834 C152.501322,48.1147834 183.665658,62.7259799 183.665658,82.1981154 C183.665658,90.5415789 176.441143,95.3944097 168.186871,95.3944097 C152.501322,95.3944097 155.387885,73.6843772 123.793808,73.6843772 C108.116367,73.6843772 99.4323541,80.7832132 99.4323541,90.9429409 C99.4323541,101.082398 111.813762,104.321672 122.565397,106.770386 L150.839116,113.046227 C181.808853,119.946409 189.661763,138.027967 189.661763,155.059498 C189.661763,181.43587 169.415282,201.130984 128.553393,201.130984 Z M148.009312,245.434856 C148.422836,245.674052 148.836361,245.880814 149.241777,246.107847 C149.695843,246.026764 150.145855,245.97406 150.591812,245.888922 L148.009312,245.434856 Z M246.715971,150.364779 C246.801109,149.914768 246.857867,149.460702 246.93895,149.01069 C246.715971,148.605274 246.517317,148.187695 246.278122,147.786333 L246.715971,150.364779 Z M9.21916225,104.946013 C9.13402486,105.383863 9.08132077,105.825766 9.00429171,106.263615 C9.23132473,106.669032 9.42997862,107.082556 9.65701164,107.479864 L9.21916225,104.946013 Z M106.38524,9.04077916 C105.971716,8.80969198 105.546029,8.61103809 105.124396,8.38805923 C104.698709,8.47319661 104.268968,8.56238815 103.843281,8.64347138 L106.38524,9.04077916 Z">
              </path>
							</g>
					</svg>
          <svg width="15px" height="15px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#2D8CFF"></path>
						<path fillRule="evenodd" clipRule="evenodd" d="M38.087 15.9353L31.3043 20.884V27.135L38.087 32.0837C38.5669 32.4503 39.1304 32.5636 39.1304 31.5628V16.4562C39.1304 15.5638 38.6782 15.4517 38.087 15.9353ZM8.34782 27.7567V16.4873C8.34782 16.0263 8.72491 15.6522 9.19007 15.6522H25.6254C28.1845 15.6522 30.2609 17.7077 30.2609 20.2433V31.5127C30.2609 31.9737 29.8838 32.3478 29.4186 32.3478H12.9833C10.4242 32.3478 8.34782 30.2923 8.34782 27.7567Z" fill="white"></path>
						</svg>
          </Typography>
          <Typography variant="body2" className={style.bookingItemsIcons}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>60分鐘</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 300 300" fill="currentColor">
						<path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.168,0-120-53.832-120-120 S83.832,30,150,30s120,53.832,120,120S216.168,270,150,270z"></path>
						<path d="M195.031,75.387C183.477,66.802,169.331,65,159.5,65h-38.846c-5.522,0-10,4.478-10,10v150c0,5.523,4.478,10,10,10h7.691 c5.522,0,10-4.477,10-10v-53.46H159.5c9.831,0,23.977-1.802,35.531-10.388c8.355-6.207,18.314-18.352,18.314-40.961v-3.843 C213.346,93.739,203.387,81.594,195.031,75.387z M185.27,119.809c0,10.484-2.671,24.424-25.77,24.424h-21.154V92.308H159.5 c23.099,0,25.77,13.939,25.77,24.424V119.809z"></path>
					</svg>
          <span>{data1.price60}元</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>120分鐘</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 300 300" fill="currentColor">
						<path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.168,0-120-53.832-120-120 S83.832,30,150,30s120,53.832,120,120S216.168,270,150,270z"></path>
						<path d="M195.031,75.387C183.477,66.802,169.331,65,159.5,65h-38.846c-5.522,0-10,4.478-10,10v150c0,5.523,4.478,10,10,10h7.691 c5.522,0,10-4.477,10-10v-53.46H159.5c9.831,0,23.977-1.802,35.531-10.388c8.355-6.207,18.314-18.352,18.314-40.961v-3.843 C213.346,93.739,203.387,81.594,195.031,75.387z M185.27,119.809c0,10.484-2.671,24.424-25.77,24.424h-21.154V92.308H159.5 c23.099,0,25.77,13.939,25.77,24.424V119.809z"></path>
					</svg>
          <span>{data1.price90}元</span>
          </Typography>
        </CardContent>
      </Card>
        </div>
        <div className={style.bookingItemsButtonContainer}>
        <Link to="notAuthCalendar" >
          <button className={style.bookingItemsButton}>   
          <FontAwesomeIcon icon={faCalendar} className={style.bookingButtonIcon}/>
          <p>預約</p>  
          </button>
        </Link>
        </div>
      </Stack>
      </div>
      </div>
      ))}
    {dataTwo.map((data2,index)=>( isMobile && <div style={{margin:"1rem"}} key={index}> <div className={style.bookingEntranceListsContainer} >
            <Container fluid>
              <Row style={{display:"flex"}} >
                <div className={style.isMobileImage} >
                  <img src={data2.url}
                  />
                </div>
                <div  className={style.isMobileHeader}>
                  <p>{data2.title}</p>
                  <p>{data2.content}</p>
                </div>
              </Row>
              <Row style={{display:"flex"}} >
              <Typography  className={style.bookingItemsIcons}>
              <svg viewBox="0 0 800 800" xmlnsXlink="http://www.w3.org/2000/svg" style={{width:"15px",height:"15px"}}>
              <path d="m0 0h800v800h-800z" fill="#3b81f5"></path>
              <path d="m654.37 323.03c-17.73-23.12-42.94-39.27-71.21-45.76l11.43-93.48c1.87-15.33-10.09-28.84-25.53-28.84h-423.5c-15.44 0-27.4 13.51-25.53 28.84l42.35 346.42c8.01 65.51 63.63 114.74 129.62 114.74h130.62c65.99 0 121.62-49.24 129.62-114.74l.75-6.16c.93.02 1.86.03 2.79.03l-.06-.07c31.19-.13 61.2-11.92 84.14-33.05s37.15-50.08 39.83-81.15-6.35-62.03-25.33-86.78zm-12.62 92.21c-4.24 22.65-17.3 42.68-36.31 55.69-14.2 9.72-30.85 14.93-47.81 15.17l20.88-170.83c20.1 5.3 37.72 17.63 49.54 34.9 13.01 19.01 17.94 42.41 13.7 65.06z" fill="#fff"></path>
              <path d="m458.74 317.2h-83.93v-42.25c0-9.67-7.83-17.5-17.5-17.5s-17.5 7.83-17.5 17.5v42.25h-83.93c-9.67 0-17.5 7.83-17.5 17.5v102.02c0 9.67 7.83 17.5 17.5 17.5h83.93v70.72c0 9.67 7.83 17.5 17.5 17.5s17.5-7.83 17.5-17.5v-70.72h83.93c9.67 0 17.5-7.83 17.5-17.5v-102.02c0-9.67-7.83-17.5-17.5-17.5zm-185.36 102.02v-67.02h66.43v67.02zm167.86 0h-66.43v-67.02h66.43z" fill="#262626"></path>
              </svg>
              <span>中文分析</span>
              <svg width="15px" height="15px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#00AFF0">
                  <g>
                  <path d="M246.93895,149.01069 C246.857867,149.460702 246.801109,149.914768 246.715971,150.364779 L246.278122,147.786333 C246.517317,148.187695 246.715971,148.605274 246.93895,149.01069 C248.260607,141.818608 248.953868,134.456251 248.953868,127.097949 C248.953868,110.779951 245.759189,94.948452 239.44686,80.0453559 C233.35751,65.64903 224.645118,52.7203104 213.536717,41.6200174 C202.444532,30.5197244 189.507704,21.8073323 175.119487,15.7179824 C160.220445,9.41376198 144.388946,6.21908306 128.070948,6.21908306 C120.380204,6.21908306 112.677298,6.94072373 105.181154,8.37995091 C105.164938,8.38400507 105.144667,8.38400507 105.124396,8.38805923 C105.546029,8.61103809 105.971716,8.80969198 106.38524,9.04077916 L103.843281,8.64347138 C104.268968,8.56238815 104.698709,8.47319661 105.124396,8.38805923 C94.8389896,2.91899596 83.2724681,0 71.564051,0 C52.4486816,0 34.4765856,7.4434397 20.9600127,20.9640668 C7.44749386,34.4806398 0,52.4527358 0,71.5681052 C0,83.7346425 3.12981234,95.6944176 9.00429171,106.263615 C9.08132077,105.825766 9.13402486,105.383863 9.21916225,104.946013 L9.65701164,107.479864 C9.42997862,107.082556 9.23132473,106.669032 9.00429171,106.263615 C7.81236836,113.111094 7.18397339,120.108576 7.18397339,127.097949 C7.18397339,143.420002 10.3786523,159.247446 16.6909811,174.154597 C22.7722227,188.554977 31.4886689,201.475588 42.5849078,212.575881 C53.6933091,223.676174 66.6139203,232.400728 81.0183546,238.473862 C95.9173965,244.790245 111.75295,247.988978 128.070948,247.988978 C135.173838,247.988978 142.292945,247.340312 149.241777,246.107847 C148.836361,245.880814 148.422836,245.674052 148.009312,245.434856 L150.591812,245.888922 C150.145855,245.97406 149.695843,246.026764 149.241777,246.107847 C159.948816,252.164764 172.070758,255.383768 184.448111,255.383768 C203.559427,255.383768 221.523414,247.95249 235.039987,234.427809 C248.560614,220.919344 256,202.943194 256,183.827825 C256,171.620746 252.853971,159.620429 246.93895,149.01069 L246.93895,149.01069 Z M128.553393,201.130984 C85.6076649,201.130984 66.3949956,180.016913 66.3949956,164.193523 C66.3949956,156.077092 72.3870457,150.389104 80.6453718,150.389104 C99.0228838,150.389104 94.2632988,176.777639 128.553393,176.777639 C146.10791,176.777639 155.801409,167.246306 155.801409,157.491995 C155.801409,151.625624 152.906738,145.122749 141.348325,142.272674 L103.15002,132.737287 C72.3870457,125.022219 66.8044659,108.39205 66.8044659,92.759205 C66.8044659,60.3015916 97.364732,48.1147834 126.064138,48.1147834 C152.501322,48.1147834 183.665658,62.7259799 183.665658,82.1981154 C183.665658,90.5415789 176.441143,95.3944097 168.186871,95.3944097 C152.501322,95.3944097 155.387885,73.6843772 123.793808,73.6843772 C108.116367,73.6843772 99.4323541,80.7832132 99.4323541,90.9429409 C99.4323541,101.082398 111.813762,104.321672 122.565397,106.770386 L150.839116,113.046227 C181.808853,119.946409 189.661763,138.027967 189.661763,155.059498 C189.661763,181.43587 169.415282,201.130984 128.553393,201.130984 Z M148.009312,245.434856 C148.422836,245.674052 148.836361,245.880814 149.241777,246.107847 C149.695843,246.026764 150.145855,245.97406 150.591812,245.888922 L148.009312,245.434856 Z M246.715971,150.364779 C246.801109,149.914768 246.857867,149.460702 246.93895,149.01069 C246.715971,148.605274 246.517317,148.187695 246.278122,147.786333 L246.715971,150.364779 Z M9.21916225,104.946013 C9.13402486,105.383863 9.08132077,105.825766 9.00429171,106.263615 C9.23132473,106.669032 9.42997862,107.082556 9.65701164,107.479864 L9.21916225,104.946013 Z M106.38524,9.04077916 C105.971716,8.80969198 105.546029,8.61103809 105.124396,8.38805923 C104.698709,8.47319661 104.268968,8.56238815 103.843281,8.64347138 L106.38524,9.04077916 Z">
                  </path>
                  </g>
              </svg>
              <svg width="15px" height="15px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#2D8CFF"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M38.087 15.9353L31.3043 20.884V27.135L38.087 32.0837C38.5669 32.4503 39.1304 32.5636 39.1304 31.5628V16.4562C39.1304 15.5638 38.6782 15.4517 38.087 15.9353ZM8.34782 27.7567V16.4873C8.34782 16.0263 8.72491 15.6522 9.19007 15.6522H25.6254C28.1845 15.6522 30.2609 17.7077 30.2609 20.2433V31.5127C30.2609 31.9737 29.8838 32.3478 29.4186 32.3478H12.9833C10.4242 32.3478 8.34782 30.2923 8.34782 27.7567Z" fill="white"></path>
                </svg>
              </Typography>
              </Row>
              <Row>
              <Typography className={style.bookingItemsIcons}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>60分鐘</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 300 300" fill="currentColor">
                <path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.168,0-120-53.832-120-120 S83.832,30,150,30s120,53.832,120,120S216.168,270,150,270z"></path>
                <path d="M195.031,75.387C183.477,66.802,169.331,65,159.5,65h-38.846c-5.522,0-10,4.478-10,10v150c0,5.523,4.478,10,10,10h7.691 c5.522,0,10-4.477,10-10v-53.46H159.5c9.831,0,23.977-1.802,35.531-10.388c8.355-6.207,18.314-18.352,18.314-40.961v-3.843 C213.346,93.739,203.387,81.594,195.031,75.387z M185.27,119.809c0,10.484-2.671,24.424-25.77,24.424h-21.154V92.308H159.5 c23.099,0,25.77,13.939,25.77,24.424V119.809z"></path>
              </svg>
              <span>{data2.price60}元</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>120分鐘</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 300 300" fill="currentColor">
                <path d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.168,0-120-53.832-120-120 S83.832,30,150,30s120,53.832,120,120S216.168,270,150,270z"></path>
                <path d="M195.031,75.387C183.477,66.802,169.331,65,159.5,65h-38.846c-5.522,0-10,4.478-10,10v150c0,5.523,4.478,10,10,10h7.691 c5.522,0,10-4.477,10-10v-53.46H159.5c9.831,0,23.977-1.802,35.531-10.388c8.355-6.207,18.314-18.352,18.314-40.961v-3.843 C213.346,93.739,203.387,81.594,195.031,75.387z M185.27,119.809c0,10.484-2.671,24.424-25.77,24.424h-21.154V92.308H159.5 c23.099,0,25.77,13.939,25.77,24.424V119.809z"></path>
              </svg>
              <span>{data2.price90}元</span>
              </Typography>
              </Row>
              <Row>
                <Button variant="success"  className={style.isMobileButton}>
                <Link to="notAuthCalendar" style={{color:"white"}}>
                    <div>
                    <FontAwesomeIcon icon={faCalendar}  style={{width:"15px",height:"15px"}}/>
                        <span >預約</span>  
                    </div>
                </Link>
                 </Button>
              </Row>
            </Container>
            </div>
          </div>
    ))}
     </div>
  );
};

export default  NotAuthEntraceBooking