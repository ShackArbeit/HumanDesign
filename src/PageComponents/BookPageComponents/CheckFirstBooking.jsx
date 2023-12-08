import { useCheckBooking } from "../../ReactQueryCompoents/CheckBookingQuery";
import style from '../../CssModules/Booking.module.css'



const CheckFirstBooking = () => {
  const{data:datas,isLoading,error}=useCheckBooking()

  if(isLoading) return <p>Loading...</p>
  if(error) return <p>Error :{error.message}</p>
  console.log(datas)
  if (datas && datas.data && datas.data.Year) {
    return (
      <div style={{height:'50vh',paddingTop:'64px'}}>
        <div>
          {datas.data.Year}, {datas.data.Month}, {datas.data.Day}, {datas.data.Hour}, {datas.data.Minute}
          ,{datas.data.BookingItem},{datas.data.TimeItem}
        </div>
      </div>
    );
  } else {
    return <p style={{height:'50vh',paddingTop:'64px'}}>No data available</p>;
  }
};
 


export default CheckFirstBooking;
