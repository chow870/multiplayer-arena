import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import store from './context/store'
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>
 
   
  
)
