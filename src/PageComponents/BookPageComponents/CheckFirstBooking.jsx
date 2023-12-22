import { useCheckBooking } from '../../ReactQueryCompoents/CheckBookingQuery';
import style from '../../CssModules/Booking.module.css'


const CheckFirstBooking = () => {
  const { data: datas, isLoading, error } = useCheckBooking (); 
  console.log(datas)
  if(isLoading) return<p>Loading...</p>
  if(error) return <p>Error:{error.message}</p>
   

  return (
    <>
    {datas.map((data) => {
      return (
        <div class={style.bookingEntranceContainer}>
        <h1>In This Page You Can Check Your Bookig !!</h1>
          <div key={data._id} className={style.bookingItem}>
              <h2 className={style.bookingInfo}> 年: {data.Year}</h2>
              <h2 className={style.bookingInfo}> 月: {data.Month + 1}</h2>
              <h2 className={style.bookingInfo}> 日: {data.Day}</h2>
              <h2 className={style.bookingInfo}> {data.Hour}時 {data.Minute}分</h2>
              <h2 className={style.bookingInfo}>預約項目 : {data.BookingItem}</h2>
              <h2 className={style.bookingInfo}>預約時長 : {data.TimeItem} </h2>
          </div>
        </div>
      );
  })}
    </>
  )
};
 
export default CheckFirstBooking;
