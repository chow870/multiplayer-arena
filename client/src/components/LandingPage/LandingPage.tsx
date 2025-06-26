import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-900 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our App!</h1>
        <p className="text-lg mb-8">PLAY, ENJOY and WIN</p>
        <button
          className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
    </>
  );
}

export default LandingPage;
