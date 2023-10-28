import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './ToolkitComponents/Store'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
