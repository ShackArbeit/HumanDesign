import { createSlice } from "@reduxjs/toolkit";

const Service=createSlice({
      name:'Service',
      initialState:[],
      reducers:{
            setServiceData:(state,action)=>{
                  return action.payload
            }
      }
})
export const {setServiceData}=Service.actions;
export default Service.reducer;