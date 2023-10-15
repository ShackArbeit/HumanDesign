import { configureStore } from '@reduxjs/toolkit'
import aboutJeromeReducer from './AboutJerome/AboutJeromeSlice'
import FeedBackReducer from './FeedBack/FeedbackSlice'
import ServiceReducer from './HomePage/ServiceSlice'

const store=configureStore({
      reducer:{
            aboutJerome:aboutJeromeReducer,
            FeedBack:FeedBackReducer,
            Service:ServiceReducer
      }
})
export default store