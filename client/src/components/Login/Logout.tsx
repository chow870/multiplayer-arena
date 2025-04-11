import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Logout() {

    const navigate = useNavigate()
     function BackendHitLogout() {
        
            if(localStorage.getItem("jwtToken")==null){
                // navigate to landling page
                console.log("token not present in local storage")
               navigate('/')

            }
            localStorage.removeItem("jwtToken");
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
