import { createSlice } from "@reduxjs/toolkit";

const FeedBack=createSlice({
      name:'FeedBack',
      initialState:[],
      reducers:{
            setFeedbackData:(state,action)=>{
                  return action.payload
            }
      }
})
export const {setFeedbackData}=FeedBack.actions;
export default FeedBack.reducer;