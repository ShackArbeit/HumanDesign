import style from '../../CssModules/Calendar.module.css'
import {Link} from 'react-router-dom'
import {  useMediaQuery } from '@mui/material';
import {useContext,useEffect} from 'react'
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');
import Button from '@mui/material/Button';
import { DateTimeContext } from '../../ContextComponents/DataTimeContext';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';


const Items = [
  { title: '個人解析' },
  { title: '多人解析'},
  { title: '親子解析' },
  { title: '團體解析'},
];
console.log(Items)
const Prices=[
  {time:'60分鐘 5000元'},
  {time:'120分鐘 9000元'},
  {time:'60分鐘 7000元'},
  {time:'120分鐘 12000元'},
  {time:'60分鐘 8000元'},
  {time:'120分鐘 14000元'},
  {time:'60分鐘 9000元'},
  {time:'120分鐘 15000元'},
]
const filterPrice = Prices.filter((price) => {
  let isValid = false;
  for (let i = 0; i < Items.length; i++) {
    if (Items[i].title === '個人解析' && (price.time === '60分鐘 5000元' || price.time === '120分鐘 9000元')) {
      isValid = true;
    } else if (Items[i].title === '多人解析' && (price.time === '60分鐘 7000元' || price.time === '120分鐘 12000元')) {
      isValid = true;
    } else if (Items[i].title === '親子解析' && (price.time === '60分鐘 8000元' || price.time === '120分鐘 14000元')) {
      isValid = true;
    } else if (Items[i].title === '團體解析' && (price.time === '60分鐘 9000元' || price.time === '120分鐘 15000元')) {
      isValid = true;
    }
  }
  return isValid;
});
   console.log(filterPrice)



export default function ResponsiveDateTimePickers() {
  const isDesktop = useMediaQuery('(min-width:576px)');
  const isMobile=useMediaQuery('(max-width:576px');
  const {selectDateTime,handleSelectDateTime,handleSendDateTime,showGoButton}=useContext(DateTimeContext)
  useEffect(()=>{
      
  },[])
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={style.BasicCalendarContainer}>
    <h3 style={{marginBottom:"3rem"}}>請點選日期及時間</h3>
      {isDesktop?(
    <div className={style.ItemContainer}>
        <DemoItem >
        <DesktopDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          width:"350px",
          border:'1px solid rgba(0,0,0,0.8)',
          '&:hover': {
            border:'1px solid #2fffe1;'
          }}} 
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn'
          slotProps={{ textField: { variant: 'outlined' } }}
          value={selectDateTime}
          onChange={handleSelectDateTime}
          />
      </DemoItem>
      <Stack spacing={2} sx={{ width: 300,marginTop:"1rem",marginBottom:'1rem'}}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
       
        options={Items.map((option) => option.title)}
        renderInput={(params) => <TextField {...params} label="解析項目" />}
      />
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={filterPrice.map((option) => option.time)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="時間"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
      {showGoButton ?
      <div className={style.ButtonContainer}>
      <Button 
      onClick={handleSendDateTime}
      variant="contained" 
      size='large'
      sx={{
        fontWeight:900,
        fontSize:'20px',
        marginRight:'1rem',
        '&:hover':{
          border:'2px solid #ffa811',
          color:'black',
          backgroundColor:'#fff'
        }
      }}>確定送出
      </Button>
      <Link to='/HumanDesign/booking/firstCheck'> <Button 
      variant="contained" 
      size='large'
      sx={{
        fontWeight:900,
        fontSize:'20px',
        '&:hover':{
          border:'2px solid #ffa811',
          color:'black',
          backgroundColor:'#fff'
        }
      }}>前往確認頁面</Button></Link>
      </div>:
       <div className={style.ButtonContainer}>
        <Button 
        onClick={handleSendDateTime}
        variant="contained" 
        size='large'
        sx={{
          fontWeight:900,
          fontSize:'20px',
          '&:hover':{
            border:'2px solid #ffa811',
            color:'black',
            backgroundColor:'#fff'
          }
        }}
        >確定送出
        </Button>
        </div>
      }
    </div>
      ):null }
      {isMobile?( 
      <>
      <DemoItem >
        <MobileDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width:"350px",
          border:'1px solid rgba(0,0,0,0.8)',
          transform: "translate(-50%, -50%)",
          '&:hover': {
              border:'1px solid #2fffe1;'
            },
        }}
          value={selectDateTime}
          onChange={handleSelectDateTime}
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn' />
      </DemoItem>
      {showGoButton ?
        <div className={style.ButtonContainerTwo}>
        <Button 
        onClick={handleSendDateTime}
        variant="contained" 
       
        sx={{
          fontWeight:900,
          fontSize:'20px',
          marginRight:'1rem',
          '&:hover':{
            border:'2px solid #ffa811',
            color:'black',
            backgroundColor:'#fff'
          }
        }}>確定送出
        </Button>
        <Link to='/HumanDesign/booking/firstCheck'> <Button 
        variant="contained" 
        sx={{
          fontWeight:900,
          fontSize:'20px',
          '&:hover':{
            border:'2px solid #ffa811',
            color:'black',
            backgroundColor:'#fff'
          }
        }}>前往確認頁面</Button></Link>
        </div>:
         <div className={style.ButtonContainer}>
          <Button 
          onClick={handleSendDateTime}
          variant="contained" 
          size='large'
          sx={{
            fontWeight:900,
            fontSize:'20px',
            '&:hover':{
              border:'2px solid #ffa811',
              color:'black',
              backgroundColor:'#fff'
            }
          }}
          >確定送出
          </Button>
          </div>
        }
      </>)
      :null}
    </div>
  </LocalizationProvider>
  );
}
