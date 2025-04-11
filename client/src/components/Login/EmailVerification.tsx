import axios from 'axios';
import React, { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {

    const [email, setEmail] = useState<string>("");
    const [otp,setOtp] = useState<number> (0)
    const [errorMessage,setErrorMessage] = useState <string>("");
    const [isError,setIsError] = useState<boolean>(false);
    const [displaySecondPart,setDisplaySecondPart] = useState<boolean>(false)
    const navigate = useNavigate();
    
    function SetOtp (e :ChangeEvent<HTMLInputElement>){
        setOtp(parseInt(e.target.value));
    }
    function SetEmail (e :ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value);
    }

    async function GenerateOTP(){
        // here hit the backend to genearte the otp
        try {
            let response = await axios.post("/api/v1/sendotp", {email: email});
            console.log(response.data);
            
            
                setDisplaySecondPart(true);
                setIsError(false);
                setErrorMessage("OTP sent to your email, please check it.");
            
            
        } catch (error) {
            // setErrorMessage(response.data.message)
            setIsError(true);
            setErrorMessage("Retry plz : ");
        }

    }
    async function VerifyOTP() {
        // here hit the backend to verify the otp
        try {
            let response = await axios.post("/api/v1/verifyotp", {email: email, otp: otp});
            console.log(response);
                // navigate to the login page now.
                navigate("/login");
            
            
        } catch (error) {
            setIsError(true);
            setErrorMessage("Retry plz");
        }
        
    }
    

  return (
    <> 
        {isError== true ? <> <div>{errorMessage}</div> </> :  <>
            {displaySecondPart== false ? <>
            <input value={email} onChange={SetEmail}  placeholder='Your email Here plz'/>
            <button onClick={GenerateOTP}>Generate OTP</button> </>:<>  
            <input value={otp} onChange={SetOtp}  placeholder='OTP' type='number'/>
            <button onClick={VerifyOTP}>Verify The OTP</button> 
            </>
            }
           
        </>}
        
    </>
    
  )
}

export default VerifyEmail