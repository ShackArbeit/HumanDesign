import {
      Calendar as BigCalendar,
      momentLocalizer,
    } from "react-big-calendar";
import moment from "moment";
import 'moment/locale/zh-cn';

    
const localizer = momentLocalizer(moment,'zh-cn');
    
    
    export default function Calendar(props) {
      return <BigCalendar {...props} localizer={localizer} />;
    }
    