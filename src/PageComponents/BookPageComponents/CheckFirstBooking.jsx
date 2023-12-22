import { useCheckBooking } from '../../ReactQueryCompoents/CheckBookingQuery';



const CheckFirstBooking = () => {
  const { data: datas, isLoading, error } = useCheckBooking (); 
  console.log(datas)
  if(isLoading) return<p>Loading...</p>
  if(error) return <p>Error:{error.message}</p>
   

  return (
    <>
    <h1>In This Page You Can Check Your Bookig !!</h1>
    {datas.map((data)=>{
      return (
        <div>
        <h2> 年: {data.Year}</h2>
        <h2> 月: {data.Month + 1}</h2>
        <h2> 日: {data.Day}</h2>
        <h2> {data.Hour}時 {data.Miunte}分</h2>
        <h2>預約項目 : {data.BookingItem}</h2>
        <h2>預約時長 : {data.TimeItem} </h2>
        </div>
    )
    })}
    </>
  )
};
 
export default CheckFirstBooking;
