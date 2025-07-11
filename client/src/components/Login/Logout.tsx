import { clearUser } from '../../context/slices/userSlice';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Logout() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
     function BackendHitLogout() {
        
            if(localStorage.getItem("jwtToken")==null){
                // navigate to landling page
                console.log("token not present in local storage")
               navigate('/')

            }
            localStorage.removeItem("token");
            dispatch(clearUser());
            //navigate ot home page plz
            navigate('/')
            console.log("logout successfull")  
        }
        
  return (
    <>
        <button onClick={BackendHitLogout}>Logout</button>
    </>
    
  )
}
