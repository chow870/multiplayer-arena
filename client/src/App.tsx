import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage/LandingPage'
import Login from './components/Login/Login'
import Signup from './components/SignUp/Signup'
import Homepage from './components/Homepage/Homepage'
import VerifyEmail from './components/Login/EmailVerification'
import Game from './components/Games/SnakeandLadder'

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
      <Route path='/game' element={<Game/>} />
      
     </Routes>

     
    </>
  )
}

export default App
