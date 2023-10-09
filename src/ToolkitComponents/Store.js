import { configureStore } from '@reduxjs/toolkit'
import aboutJeromeReducer from './AboutJerome/AboutJeromeSlice'

const store=configureStore({
      reducer:{
            aboutJerome:aboutJeromeReducer
      }
})
export default store