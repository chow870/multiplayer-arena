import axios from 'axios';
import { console } from 'inspector';
import React, { ChangeEvent, useState } from 'react'

function VerifyEmail() {

    const [email, setEmail] = useState<string>("");
    const [otp,setOtp] = useState<number> (0)
    const [isError,setIsError] = useState<boolean>(false);
    const [displaySecondPart,setDisplaySecondPart] = useState<boolean>(false)
    
    function SetOtp (e :ChangeEvent<HTMLInputElement>){
        setOtp(parseInt(e.target.value));
    }
    function SetEmail (e :ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value);
    }

    async function GenerateOTP(){
        // here hit the backend to genearte the otp
    }
    async function VerifyOTP() {
        // here hit the backend to verify the otp
        
    }
    

  return (
    <> 
        {isError== true ? <> <div>Here is will display the error </div> </> :  <>
            {displaySecondPart== false ? <><input value={email} onChange={SetEmail}  placeholder='Your email Here plz'/>  <button onClick={GenerateOTP}>Generate OTP</button> </> :<>  <input value={otp} onChange={SetOtp}  placeholder='OTP' type='number'/> <button onClick={VerifyOTP}>Verify The OTP</button> </>}
           
            
          
           

        </>}
        
    </>
    
  )
}

export default VerifyEmail