import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [displaySecondPart, setDisplaySecondPart] = useState<boolean>(false);
    const navigate = useNavigate();

    function SetOtp(e: ChangeEvent<HTMLInputElement>) {
        setOtp(parseInt(e.target.value));
    }

    function SetEmail(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    async function GenerateOTP() {
        try {
            let response = await axios.post("/api/v1/sendotp", { email });
            console.log(response.data);
            setDisplaySecondPart(true);
            setIsError(false);
            setErrorMessage("OTP sent to your email.");
        } catch (error) {
            setIsError(true);
            setErrorMessage("Failed to send OTP. Try again.");
        }
    }

    async function VerifyOTP() {
        try {
            let response = await axios.post("/api/v1/verifyotp", { email, otp });
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            setIsError(true);
            setErrorMessage("Invalid OTP. Please try again.");
        }
    }

    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center">
            <div className="bg-white text-black p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>

                {isError && <div className="text-red-600 text-center mb-4">{errorMessage}</div>}
                {!isError && errorMessage && (
                    <div className="text-green-600 text-center mb-4">{errorMessage}</div>
                )}

                {!displaySecondPart ? (
                    <>
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={SetEmail}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={GenerateOTP}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            Generate OTP
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="number"
                            placeholder="Enter OTP"
                            value={otp || ""}
                            onChange={SetOtp}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={VerifyOTP}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            Verify OTP
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
// This component allows users to verify their email by sending an OTP to their email address.
// The user can then enter the OTP to verify their email. If the OTP is valid, they are redirected to the login page.
