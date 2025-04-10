import axios from 'axios';
import { console } from 'inspector';
import React, { ChangeEvent, useState } from 'react'

function Login() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isError,setIsError] = useState<boolean>(false);
    const [errorMessage,setErrorMessage] = useState<string>("");
    
    function SetUsername (e :ChangeEvent<HTMLInputElement>){
        setUsername(e.target.value);
    }
    function SetEmail (e :ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value);
    }

    async function LoginBackendHit(){
        // axios hit backend hit karega.
        console.log("reacehd the login submit form ")
        let response = await axios.post('',{input : {username :username,email:email}});
        
        // here i will update after the backend and routing is done
        if(response.status == 200 || response.status ==201) {
            // redirect to home page.
            // here i will set something in the local storage also.
        }
        else if(response.status == 403){
            console.log("email not verified ")
            console.log("redirect to EmailVerification page ")
        }
        else{
            setIsError(true);
            setErrorMessage(response.data.message);
        }
    }



  return (
    <> 
        {isError== true ? <> <div>{errorMessage}</div> </> :  <>

            <div>Login Here </div>
            <input value={username} onChange={SetUsername}  placeholder='Your Username Here plz'/>
            <input value={email} onChange={SetEmail}  placeholder='Your email Here plz'/>
            <button onClick={LoginBackendHit}>Login</button>

        </>}
        
    </>
    
  )
}

export default Login