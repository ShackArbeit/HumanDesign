import { createSlice } from "@reduxjs/toolkit";
const aboutJerome=createSlice({
      name:'aboutJerome',
      initialState:[],
      reducers:{
            setData:(state,action)=>{
                  return action.payload
            }
      }
})
export const {setData}=aboutJerome.actions;
export default aboutJerome.reducer;