import style from '../../CssModules/Calendar.module.css'
import {Link} from 'react-router-dom'
import {  useMediaQuery } from '@mui/material';
import {useContext,useState} from 'react'
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



const options = {
  個人解析: ['60分鐘 5,000 元', '120 分鐘 9,000 元'],
  多人解析: ['60分鐘 7,000 元', '120 分鐘 12,000 元'],
  親子解析: ['60分鐘 8,000 元', '120 分鐘 14,000 元'],
  團體解析: ['60分鐘 9,000 元', '120 分鐘 15,000 元'],
};
 



export default function ResponsiveDateTimePickers() {
  const isDesktop = useMediaQuery('(min-width:576px)');
  const isMobile=useMediaQuery('(max-width:576px');
  const {selectDateTime,handleSelectDateTime,handleSendDateTime,showGoButton,
    firstValue,secondOptions,handleFirstAutocompleteChange,secondItem,handleSecondAutocompleteChange
  }=useContext(DateTimeContext)
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={style.BasicCalendarContainer}>
    <h3 style={{marginBottom:"3rem"}}>請點選日期及項目</h3>
      {isDesktop?(
    <div className={style.ItemContainer}>
        <DemoItem >
        <DesktopDateTimePicker 
        sx={{
          width:"350px",
          '&:hover': {
            border:'2px solid #1192ff;'
          }}} 
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn'
          slotProps={{ textField: { variant: 'outlined' } }}
          value={selectDateTime}
          onChange={handleSelectDateTime}
          />
      </DemoItem>
      <Stack spacing={2} sx={{ 
        width: 350,marginTop:"1rem",
        marginBottom:'1rem',
      }}>
      <Autocomplete
      sx={{
        '&:hover': {
          border:'2px solid #1192ff;'
        }}}
      id="free-solo-demo"
      freeSolo
      options={Object.keys(options)}
      value={firstValue}
      onChange={handleFirstAutocompleteChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="項目"
        />
      )}
    />
    <Autocomplete
        freeSolo
        sx={{
          '&:hover': {
            border:'2px solid #1192ff;'
          }}}
        id="free-solo-2-demo"
        disableClearable
        options={secondOptions}
        value={secondItem}
        onChange={handleSecondAutocompleteChange}
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
      <div className={style.ItemContainer}>
      <DemoItem  >
        <MobileDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          border:'1px solid rgba(0,0,0,0.8)',
          width:280,
          '&:hover': {
              border:'1px solid #1192ff;'
            },
        }}
          value={selectDateTime}
          onChange={handleSelectDateTime}
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn' />
      </DemoItem>
      <Stack spacing={2} sx={{ 
        width: 280,
        marginTop:'2rem',
        '&:hover': {
          border:'2px solid #1192ff;'
        }}}>
        <Autocomplete
        sx={{
          '&:hover': {
            border:'2px solid #1192ff;'
          }}}
        id="free-solo-demo"
        freeSolo
        options={Object.keys(options)}
        value={firstValue}
        onChange={handleFirstAutocompleteChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="項目"
          />
        )}
      />
      <Autocomplete
          freeSolo
          sx={{
            '&:hover': {
              border:'2px solid #1192ff;'
            }}}
          id="free-solo-2-demo"
          disableClearable
          options={secondOptions}
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
      </div>)
      :null}
    </div>
  </LocalizationProvider>
  );
}