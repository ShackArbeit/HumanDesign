import { configureStore } from '@reduxjs/toolkit'
import aboutJeromeReducer from './AboutJerome/AboutJeromeSlice'
import FeedBackReducer from './FeedBack/FeedbackSlice'
import ServiceReducer from './HomePage/ServiceSlice'
import BookingReducer from './HomePage/BookingSlice'
import HoverHumanReducer from './WhatIsHumanDesign/HoverHumanSlice'

const store=configureStore({
      reducer:{
            aboutJerome:aboutJeromeReducer,
            FeedBack:FeedBackReducer,
            Service:ServiceReducer,
            Booking:BookingReducer,
            HoverHuman:HoverHumanReducer
      }
})
export default store