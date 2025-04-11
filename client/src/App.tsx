import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage/LandingPage'
import Login from './components/Login/Login'
import Signup from './components/SignUp/Signup'
import Homepage from './components/Homepage/Homepage'
import VerifyEmail from './components/Login/EmailVerification'

function App() {
 

  // navbar has to be added later on
  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path= '/signup' element={<Signup/>}/>
      <Route path='/verify' element={<VerifyEmail/>}/>
      <Route path='/home' element={<Homepage/>} />
     </Routes>

     
    </>
  )
}

export default App
