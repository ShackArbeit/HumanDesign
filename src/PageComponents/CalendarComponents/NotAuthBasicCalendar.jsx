import style from '../../CssModules/Calendar.module.css'
import {Link} from 'react-router-dom'
import {  useMediaQuery } from '@mui/material';
import {useContext} from 'react'
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');
import Button from '@mui/material/Button';
import { NoAuthDateTimeContext } from '../../ContextComponents/NoAuthDateContext';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';



const options = {
  個人解析: {'60分鐘 5,000 元': '120 分鐘 9,000 元'},
  多人解析: {'60分鐘 7,000 元':'120 分鐘 12,000 元'},
  親子解析: {'60分鐘 8,000 元':'120 分鐘 14,000 元'},
  團體解析: {'60分鐘 9,000 元':'120 分鐘 15,000 元'},
};
 



export default function NotAuthBasicCalendar() {
  const isDesktop = useMediaQuery('(min-width:576px)');
  const isMobile=useMediaQuery('(max-width:576px');
  const {
    selectDateTime,
    handleSelectDateTime,
    handleSendDateTime,
    showGoButton,
    firstValue,
    secondOptions,
    handleFirstAutocompleteChange,
    secondItem,
    handleSecondAutocompleteChange,
    handleDeleteFirstBooking,
    handleResetBooking,
    showOriginButton,
    email,
    setEmail,
    handleSendEmail
  }=useContext(NoAuthDateTimeContext )
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={style.BasicCalendarContainer}>
    <h3 style={{marginBottom:"1rem"}}>請先輸入 Email 後點選日期及項目</h3>
    {isDesktop?(
    <div className={style.ItemContainer}>
        <DemoItem >
        <input 
        type='email'
        placeholder='請輸入Email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className={style.EmailInput}
        />
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
      // id="free-solo-demo"
      freeSolo
      options={Object.keys(options)}
      value={firstValue}
      getOptionLabel={(option) => option}
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
        // id="free-solo-2-demo"
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
      { showOriginButton ? (
        <div className={style.ButtonContainer}>
        <Button
            onClick={handleSendDateTime}
            variant="contained"
            size="large"
            sx={{
              fontWeight: 900,
              marginRight:'1.5rem',
              fontSize: '20px',
              '&:hover': {
                border: '2px solid #ffa811',
                color: 'black',
                backgroundColor: '#fff',
              },
            }}
          >
            確定送出
          </Button>
          <Button
            onClick={handleResetBooking}
            variant="contained"
            size="large"
            sx={{
              fontWeight: 900,
              fontSize: '20px',
              marginRight: '1.5rem',
              '&:hover': {
                border: '2px solid #ffa811',
                color: 'black',
                backgroundColor: '#fff',
              },
            }}
          >
            重新選取
          </Button>
        </div>
      ) : (
        <>
          <Button
            onClick={handleDeleteFirstBooking}
            variant="contained"
            size="large"
            sx={{
              fontWeight: 900,
              fontSize: '20px',
              marginRight: '1rem',
              '&:hover': {
                border: '2px solid #ffa811',
                color: 'black',
                backgroundColor: '#fff',
              },
            }}
          >
            刪除此次預約
          </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSendEmail}
              sx={{
                fontWeight: 900,
                fontSize: '20px',
                '&:hover': {
                  border: '2px solid #ffa811',
                  color: 'black',
                  backgroundColor: '#fff',
                },
              }}
            >
              確認預約並返回首頁
            </Button>
        </>
      )}
      </div>    
     :
       <div className={style.ButtonContainer}>
       <Button 
       onClick={handleSendDateTime}
       variant="contained" 
       size='large'
       sx={{
         fontWeight:900,
         fontSize:'20px',
         marginRight:'1.5rem',
         '&:hover':{
           border:'2px solid #ffa811',
           color:'black',
           backgroundColor:'#fff'
         }
       }}
       >確定送出
       </Button>
       <Button 
        onClick={handleResetBooking}
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
        >重新選取
        </Button>
        </div>
    }
    </div>
      ):null }
      {isMobile?(
        <div className={style.ItemContainer}>
            <DemoItem >
            <input 
              type='email'
              placeholder='請輸入Email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className={style.EmailInput}
            />
            <MobileDateTimePicker  
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
          id="free-solo-demo"
          freeSolo
          sx={{
            '&:hover': {
              border:'2px solid #1192ff;'
            }}} 
          options={Object.keys(options)}
          value={firstValue}
          getOptionLabel={(option) => option}
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
            id="free-solo-2-demo"
            disableClearable
            sx={{
              '&:hover': {
                border:'2px solid #1192ff;'
              }}} 
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
          { showOriginButton ? (
            <div className={style.ButtonContainerTwo}>
            <Button
                onClick={handleSendDateTime}
                variant="contained"
                size="large"
                sx={{
                  fontWeight: 900,
                  marginRight:'1.5rem',
                  fontSize: '20px',
                  '&:hover': {
                    border: '2px solid #ffa811',
                    color: 'black',
                    backgroundColor: '#fff',
                  },
                }}
              >
                確定送出
              </Button>
              <Button
                onClick={handleResetBooking}
                variant="contained"
                size="large"
                sx={{
                  fontWeight: 900,
                  fontSize: '20px',
                  marginRight: '1.5rem',
                  '&:hover': {
                    border: '2px solid #ffa811',
                    color: 'black',
                    backgroundColor: '#fff',
                  },
                }}
              >
                重新選取
              </Button>
            </div>
          ) : (
            <>
            <div className={style.ButtonContainerTwo}>
              <Button
                onClick={handleDeleteFirstBooking}
                variant="contained"
                size="large"
                sx={{
                  fontWeight: 900,
                  fontSize: '20px',
                  marginRight: '1rem',
                  marginBottom:'1.5rem',
                  '&:hover': {
                    border: '2px solid #ffa811',
                    color: 'black',
                    backgroundColor: '#fff',
                  },
                }}
              >
                刪除此次預約
              </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSendEmail}
                  sx={{
                    fontWeight: 900,
                    fontSize: '20px',
                    '&:hover': {
                      border: '2px solid #ffa811',
                      color: 'black',
                      backgroundColor: '#fff',
                    },
                  }}
                >
                  確認預約並返回首頁
                </Button>
              </div>
            </>
          )}
          </div>    
         :
         <div className={style.ButtonContainerTwo}>
           <Button 
           onClick={handleSendDateTime}
           variant="contained" 
           size='large'
           sx={{
             fontWeight:900,
             fontSize:'20px',
             marginRight:'1.5rem',
             '&:hover':{
               border:'2px solid #ffa811',
               color:'black',
               backgroundColor:'#fff'
             }
           }}
           >確定送出
           </Button>
           <Button 
            onClick={handleResetBooking}
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
            >重新選取
            </Button>
          </div>
        }
        </div>
          ) :null}
    </div>
  </LocalizationProvider>
  );
}