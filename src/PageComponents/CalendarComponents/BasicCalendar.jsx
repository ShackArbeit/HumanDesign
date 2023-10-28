import Calendar from "./Calendar";
import moment from "moment";

const events = [
  {
    start: moment("2023-10-28T10:00:00").toDate(),
    end: moment("2023-10-28T11:00:00").toDate(),
    title: "MRI Registration",
  },
  {
    start: moment("2023-10-28T14:00:00").toDate(),
    end: moment("2023-10-28T15:30:00").toDate(),
    title: "ENT Appointment",
  },
];
const minTime = new Date().setHours(8, 0, 0, 0); // 8:00 AM
const maxTime = new Date().setHours(18, 0, 0, 0); // 6:00 PM

const BasicCalendar = () => {
  return (
    <div style={{ height: "100vh", marginTop: "64px" }}>
      <Calendar events={events}
                 min={minTime}
                 max={maxTime}
                defaultView={"week"}
                views={["month","week"]} />
    </div>
  );
};

export default BasicCalendar;


