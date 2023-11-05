import style from '../../CssModules/Calendar.module.css'
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
dayjs.locale('zh-cn');


export default function ResponsiveDateTimePickers() {
  const isDesktop = useMediaQuery('(min-width:576px)');
  const isMobile=useMediaQuery('(max-width:576px');
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={style.BasicCalendarContainer}>
    <h3 style={{marginBottom:"3rem"}}>請點選日期及時間</h3>
      {isDesktop?(
        <DemoItem  >
        <DesktopDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"}} 
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn'
          />
      </DemoItem>):null}
      {isMobile?( <DemoItem >
        <MobileDateTimePicker 
        defaultValue={dayjs('2023-11-06T18:30')}
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)"}}
          format="YYYY年MM月DD日 hh:mm A "
          locale='zh-cn' />
      </DemoItem>):null}
    </div>
  </LocalizationProvider>
  );
}
