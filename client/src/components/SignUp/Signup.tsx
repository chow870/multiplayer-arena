import axios from 'axios'
import React, { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const navigate = useNavigate()

  function SetUsername(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value)
  }

  function SetEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function SetPassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  async function SignupBackendHit() {
    try {
      const response = await axios.post('/api/v1/signup', {
        username,
        email,
        password
      })

      if (response.status === 200 || response.status === 201) {
        console.log("Signup successful")
        navigate("/login")
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log("Email already in use")
        navigate("/login")
      } else {
        setIsError(true)
        setErrorMessage(error.response?.data?.message || "Signup failed")
      }
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup Here</h2>

        {isError && (
          <div className="mb-4 text-red-600 font-medium text-center">{errorMessage}</div>
        )}

        <input
          className="w-full px-4 py-2 mb-4 border rounded"
          value={username}
          onChange={SetUsername}
          placeholder="Your Username"
        />
        <input
          className="w-full px-4 py-2 mb-4 border rounded"
          value={email}
          onChange={SetEmail}
          placeholder="Your Email"
        />
        <input
          className="w-full px-4 py-2 mb-4 border rounded"
          type="password"
          value={password}
          onChange={SetPassword}
          placeholder="Your Password"
        />
        <button
          onClick={SignupBackendHit}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Signup
        </button>
      </div>
    </div>
  )
}

export default Signup
