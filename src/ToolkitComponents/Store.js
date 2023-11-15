import { configureStore } from '@reduxjs/toolkit'
import aboutJeromeReducer from './AboutFetchApi/AboutJeromeSlice'
import BookingStoreDataReducer from './BookingSlice'


const store=configureStore({
      reducer:{
            aboutJerome:aboutJeromeReducer,
            BookingStoreData:BookingStoreDataReducer
      }
})
export default store