import axios from 'axios';
import React, { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isError,setIsError] = useState<boolean>(false);
    const [errorMessage,setErrorMessage] = useState<string>("");
    const navigate = useNavigate();
    
    function SetPassword (e :ChangeEvent<HTMLInputElement>){
        setPassword(e.target.value);
    }
    function SetEmail (e :ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value);
    }

    async function LoginBackendHit() {
        try {
            console.log("Reached the login submit form");
            const response = await axios.post('/api/v1/login', {
                email,
                password,
            });

            console.log("Response from the backend for login is ", response);
            console.log("Response status from the backend is ", response.status);

            if (response.status === 200 || response.status === 201) {
                console.log("Login successful");
                console.log(response.data.token);
                // Store the token in localStorage
                localStorage.setItem("jwtToken", response.data.token);
                // Redirect to home page
                navigate("/home");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error);
                if (error.response?.status === 403) {
                    console.log("Email not verified");
                    console.log("Redirecting to EmailVerification page");
                    navigate("/verify");
                } else {
                    setIsError(true);
                    setErrorMessage(error.response?.data?.message || "An error occurred");
                }
            } else {
                console.error("Unexpected error:", error);
                setIsError(true);
                setErrorMessage("An unexpected error occurred");
            }
        }
    }

  return (
    <> 
        {isError== true ? <> <div>{errorMessage}</div> </> :  <>

            <div>Login Here </div>
            <input value={email} onChange={SetEmail}  placeholder='Your email Here plz'/>
            <input value={password} onChange={SetPassword}  placeholder='Your Password' />
            <button onClick={LoginBackendHit}>Login</button>

        </>}
        
    </>
    
  )
}

export default Login