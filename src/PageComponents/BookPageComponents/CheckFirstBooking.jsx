import {  useContext } from 'react';
import { DateTimeContext } from '../../ContextComponents/DataTimeContext';



const CheckFirstBooking = () => {
  const { selectDateTime } = useContext(DateTimeContext);
  

  return (
    <div style={{ height: '800px', paddingTop: '80px' }}>
          <p>The year you have reserved is: {selectDateTime.$y}</p>
          <p>The month you have reserved is: {selectDateTime.$M}</p>
          <p>The date you have reserved is: {selectDateTime.$D}</p>
          <p>The time you reserved is: {selectDateTime.$H} hours {selectDateTime.$m} minutes</p>
    </div>
  );
};

export default CheckFirstBooking;

