import { configureStore } from '@reduxjs/toolkit'
import aboutJeromeReducer from './AboutFetchApi/AboutJeromeSlice'


const store=configureStore({
      reducer:{
            aboutJerome:aboutJeromeReducer
      }
})
export default store