import { configureStore } from '@reduxjs/toolkit'
import aboutJeromeReducer from './AboutJerome/AboutJeromeSlice'
import FeedBackReducer from './FeedBack/FeedbackSlice'

const store=configureStore({
      reducer:{
            aboutJerome:aboutJeromeReducer,
            FeedBack:FeedBackReducer
      }
})
export default store