import { createSlice } from "@reduxjs/toolkit";

const Booking=createSlice({
      name:'Booking',
      initialState:[],
      reducers:{
            setBookingData:(state,action)=>{
                  return action.payload
            }
      }
})
export const {setBookingData}=Booking.actions;
export default Booking.reducer;