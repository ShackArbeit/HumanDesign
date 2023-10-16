import { createSlice } from "@reduxjs/toolkit";

const HoverHuman=createSlice({
      name:'HoverHuman',
      initialState:[],
      reducers:{
            setHoverHumanData:(state,action)=>{
                  return action.payload
            }
      }
})
export const { setHoverHumanData}=HoverHuman.actions;
export default HoverHuman.reducer;