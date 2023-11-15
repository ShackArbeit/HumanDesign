import { createSlice } from "@reduxjs/toolkit";

const BookingStoreData=createSlice({
    name:'BookingStoreData',
    initialState:[],
    reducers:{
        setData:(state,action)=>{
            return state
        }
    }
})
export const {setData}=BookingStoreData.actions;
export default BookingStoreData.reducer;