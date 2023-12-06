import { useCheckBooking } from "../../ReactQueryCompoents/CheckBookingQuery";


const CheckFirstBooking = () => {
  const{data:datas,isLoading,error}=useCheckBooking()
  if(isLoading) return <p>Loading...</p>
  if(error) return <p>Error :{error.message}</p>
  console.log(datas)
  if (datas && datas.data && datas.data.Year) {
    return (
      <div>
        <div>
          {datas.data.Year}, {datas.data.Month}, {datas.data.Day}, {datas.data.Hour}, {datas.data.Minute}
        </div>
      </div>
    );
  } else {
    return <p>No data available</p>;
  }
};
 


export default CheckFirstBooking;
