
import { setUser } from '../../context/slices/userSlice';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function SetPassword(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }
    function SetEmail(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    async function LoginBackendHit() {
        try {
            const response = await axios.post('/api/v1/login', { email, password });

            if (response.status === 200 || response.status === 201) {
                localStorage.setItem("jwtToken", response.data.token);
                dispatch(setUser(response.data.user));
                navigate("/home");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    navigate("/verify");
                } else {
                    setIsError(true);
                    setErrorMessage(error.response?.data?.message || "An error occurred");
                }
            } else {
                setIsError(true);
                setErrorMessage("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center">
            <div className="bg-white text-black p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {isError && <div className="text-red-600 text-center mb-4">{errorMessage}</div>}

                <input
                    type="email"
                    placeholder="Your email here"
                    value={email}
                    onChange={SetEmail}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={SetPassword}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={LoginBackendHit}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
