import axios from 'axios';
import { console } from 'inspector';
import React, { ChangeEvent, useState } from 'react'
import { redirect } from 'react-router-dom';
import { json } from 'stream/consumers';

function Signup() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isError,setIsError] = useState<boolean>(false);
    const [errorMessage,setErrorMessage] =  useState <string>("");
    
    function SetUsername (e :ChangeEvent<HTMLInputElement>){
        setUsername(e.target.value);
    }
    function SetEmail (e :ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value);
    }

    async function SignupBackendHit(){
        // axios hit backend hit karega.
        console.log("reacehd the login submit form ")
        let response = await axios.post('/signUp',{input : {username :username,email:email}});
        
        // here i will update after the backend and routing is done
        if(response.status == 200 || response.status ==201) {
            // redirect to home page.
        }
        else if (response.status == 409){
            console.log("Email Already in use .")
            console.log('redirect to login page.')
        }
        else{
            setIsError(true);
            setErrorMessage(response.data.message)
        }
    }



  return (
    <> 
        {isError== true ? <> <div>{errorMessage}</div> </> :  <>

            <div>Login Here </div>
            <input value={username} onChange={SetUsername}  placeholder='Your Username Here plz'/>
            <input value={email} onChange={SetEmail}  placeholder='Your email Here plz'/>
            <button onClick={SignupBackendHit}>Login</button>

        </>}
        
    </>
    
  )
}

export default Signup