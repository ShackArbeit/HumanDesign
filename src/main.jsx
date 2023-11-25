import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './ToolkitComponents/Store'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'; 
import App from './App.jsx'

const queryClient=new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </Provider>,
)