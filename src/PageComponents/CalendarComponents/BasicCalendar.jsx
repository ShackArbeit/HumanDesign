import Calendar from "./Calendar";
import style from '../../CssModules/Calendar.module.css'
import moment from "moment";

const events = [
   { start: moment("2023-11-06T19:00:00").toDate(),
     end: moment("2023-11-06T23:00:00").toDate(),    
     title: "可預約時段",
    },
]
const minTime = new Date().setHours(16, 0, 0, 0); 
const maxTime = new Date().setHours(23, 0, 0, 0); 

const BasicCalendar = () => {
  return (
    <div className={style.BasicCalendarContainer}>
      <Calendar 
                 events={events}
                 step={60}
                 min={minTime}
                 max={maxTime}
                 defaultView={"week"}
                 views={["month","week"]}
                 />
    </div>
  );
};

export default BasicCalendar;


